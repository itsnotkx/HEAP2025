import os
import psycopg2
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpBinary, LpStatus, LpStatusOptimal
from datetime import datetime, timedelta
from math import radians, cos, sin, asin, sqrt, inf
import json


def fetch_travel_time(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    distance = R * c * 1.25 #distance in km, 1.25 multiplier to account for urban buildings
    
    if distance < 2:
        #estimate with walking speed:
        return distance / 5 * 60 #returns time in minutes
    else:
        return distance #returns time in minutes, estimates car time

def handler(event, context):
    #parameters needed to schedule: start time, end time, user object
    #output: json object, array of events(in order)

    #1) fetch related events from database that fall within this timing
    try:
        conn = psycopg2.connect(
            host = os.getenv("DB_HOST"),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT', 5432)
        )

        cursor = conn.cursor()
        start_time = event["queryStringParameters"]["starttime"]
        end_time = event["queryStringParameters"]["endtime"]
        userId = event["queryStringParameters"]["userId"]
        meal_one = event["queryStringParameters"]["meal1"] #default: None
        meal_two = event["queryStringParameters"]["meal2"] #default: None
        meal_three = event["queryStringParameters"]["meal3"] #default: None
        
        params = (start_time, end_time)

        event_query = """
                SELECT * FROM events
                WHERE start_date >= %s
                AND (start_date + (duration || ' hours')::interval) <= %s
                """
        cursor.execute(event_query, params)
        event_results = cursor.fetchall()

        user_query = f"""
                    SELECT * FROM user
                    WHERE user_id = {userId}
                    """
        user = cursor.execute(user_query)
        user_results = cursor.fetchall()
        user_tags = user_results[3] #3 = preferences array
        specified_mealtimes = False
        
        results_score_map = generate_score_map(event_results, user_tags)

        if meal_one:
            results_score_map[meal_one] = inf
            specified_mealtimes = True
        if meal_two:
            results_score_map[meal_one] = inf
            specified_mealtimes = True
        if meal_three:
            results_score_map[meal_one] = inf
            specified_mealtimes = True

        #now, we use ILP algorithm to maximise score while fitting as many events as possible within the allocated time brackets.
        #key constraint: event timeslots CANNOT overlap

        result = generate_schedule(results_score_map, specified_mealtimes)

        return {
            'statusCode' : 200,
            'result' : json.dumps(result)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'error': str(e)
        }

def generate_score_map(event_results, user_preferences):
    res = {}
    for event in event_results:
        #calculate the event score based on the user's tags(in order)
        # Score: dot product of tag_scores and user_preferences

        tag_scores = event[6]
        score = sum(p * t for p, t in zip(user_preferences, tag_scores))
        res[tuple(event)] = score
    
    sorted_event_scores = dict(sorted(res.items(), key=lambda item: item[1], reverse=True))
    return sorted_event_scores

def generate_schedule(results_score_map, specified_mealtimes):
    # ILP ALGORITHM EXPLANATION:
        
    # parameters: Dictionary(Event, Satisfaction score(calculated based on tag matching))

    # we define decision variables for each event: 0 being the event is not selected, and 1 being the event is selected. 
    # the "satistaction" gained from every event can then be represented as decision variable * satisfaction score
    
    # Our goal in this problem is to maximise the satisfaction gained from the events

    # constraints: 1) No overlapping events(including travel time)
    #              2) Flexible meal break windows(Lunch from 11-2, 1h window, dinner from 6-8, 1h window)
    
    # we model constraint 1 using the following: for each pair of events, (i, j), j_start must be AFTER (i_end + travel time).
    # meaning, we can model this as decision variable i + decision variable j = 1, for every pair of events (i, j)
    
    # constraint 2 has 2 subsets: 1) Fully random(meal times not specified)
    #                             2) meal times are specified -> we just model meal time as a block with satisfaction score int_max. This forces the algorithm to always include the meal time as max satisfaction
    # if meal times are not specified, for every event i, we compute the overlap with the meal window as (overlap) = max((end time of event i - start time of meal window), 0)
    # then, the sum of overlaps must be less than (meal window length) - 1 -> ensures 1h left for meal windows

    events = list(results_score_map.keys())
    scores = [results_score_map[e] for e in events]
    n = len(events)
    prob = LpProblem("Event scheduling", LpMaximize)
    x = [LpVariable(f"x_{i}", cat = LpBinary) for i in range(n)]
    prob += lpSum([x[i] * scores[i] for i in range(n)])
    LUNCH_WINDOW = (11, 14)
    DINNER_WINDOW = (17, 20)
    BREAKFAST_WINDOW = (8, 10)
    MEAL_DURATION = timedelta(hours = 1)

    for i in range(n):
        for j in range(i + 1, n):
            e1, e2 = events[i], events[j]
            
            # Extract start and end times
            # Assuming event format: [id, name, start_time, end_time, location, lat, lon, ...]
            start1, end1 = e1[2], e1[3]
            start2, end2 = e2[2], e2[3]
            
            # Calculate travel time between events
            travel_time = timedelta(minutes=fetch_travel_time(e1[5], e1[6], e2[5], e2[6]))
            
            # Check if events overlap (considering travel time)
            # Events overlap if: start1 < end2 + travel AND start2 < end1 + travel
            if (start1 < end2 + travel_time and start2 < end1 + travel_time):
                prob += x[i] + x[j] <= 1, f"NonOverlap_{i}_{j}"
    
    # Constraint 2: Meal break windows
    if not specified_mealtimes:
        meal_windows = [
            (BREAKFAST_WINDOW, "Breakfast"),
            (LUNCH_WINDOW, "Lunch"), 
            (DINNER_WINDOW, "Dinner")
        ]
        
        for (window_start_hour, window_end_hour), meal_label in meal_windows:
            def calculate_overlap_hours(event):
                """Calculate overlap between event and meal window in hours"""
                start_time, end_time = event[2], event[3]
                
                # Create meal window times on the same date as the event
                meal_start = start_time.replace(hour=window_start_hour, minute=0, second=0, microsecond=0)
                meal_end = start_time.replace(hour=window_end_hour, minute=0, second=0, microsecond=0)
                
                # Calculate overlap
                overlap_start = max(start_time, meal_start)
                overlap_end = min(end_time, meal_end)
                
                if overlap_start < overlap_end:
                    overlap_duration = overlap_end - overlap_start
                    return overlap_duration.total_seconds() / 3600  # Convert to hours
                else:
                    return 0
            
            # Constraint: Total overlap with meal window must leave at least 1 hour for meal
            window_duration = window_end_hour - window_start_hour
            prob += lpSum([
                x[i] * calculate_overlap_hours(events[i]) 
                for i in range(n)
            ]) <= window_duration - MEAL_DURATION, f"{meal_label}_constraint"
    
    else:
        # If meal times are specified, add them as high-priority events
        # This would require adding specified meal times to the events list
        # with very high satisfaction scores to force their inclusion
        pass
    
    # Solve the problem
    prob.solve()
    
    # Extract results
    if prob.status == LpStatusOptimal:
        selected_events = [events[i] for i in range(n) if x[i].varValue == 1]
        total_satisfaction = sum(scores[i] for i in range(n) if x[i].varValue == 1)
        
        return {
            'selected_events': selected_events,
            'total_satisfaction': total_satisfaction,
            'status': prob.status,
            'status_description': LpStatus[prob.status]
        }
    else:
        return {
            'selected_events': [],
            'total_satisfaction': 0,
            'status': prob.status,
            'status_description': LpStatus[prob.status]
        }