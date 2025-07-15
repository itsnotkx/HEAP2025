from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from schemas.event import EventCreate, EventUpdate, EventOut
from crud import event as event_crud
from crud import user as user_crud
from db.session import get_db

router = APIRouter(
    prefix="/events",
    tags=["events"]
)


@router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    return event_crud.create_event(db, event)

@router.get("/", response_model=List[EventOut])
def read_all_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return event_crud.get_all_events(db, skip=skip, limit=limit)

@router.get("/search", response_model=List[EventOut])
def search_for_events_keyword(
    start_date: Optional[datetime] = Query(None, description="Start date in ISO format"),
    end_date: Optional[datetime] = Query(None, description="End date in ISO format"),
    user_id: int = Query(None, description="User ID to filter events by user preferences"),
    keyword: Optional[str] = Query(None, description="The keyword to match"),
    db: Session = Depends(get_db)
):
    events = event_crud.search_event_keyword(db, user_id, keyword, start_date, end_date)
    if not events:
        raise HTTPException(status_code=404, detail="No events found for the given criteria")
    return events

@router.get("/{event_id}", response_model=EventOut)
def read_event(event_id: int, db: Session = Depends(get_db)):
    event = event_crud.get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventOut)
def update_event(event_id: int, event_update: EventUpdate, db: Session = Depends(get_db)):
    event = event_crud.update_event(db, event_id, event_update)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    success = event_crud.delete_event(db, event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    
    
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpBinary, LpStatus, LpStatusOptimal
from datetime import datetime, timedelta
from math import radians, cos, sin, asin, sqrt, inf
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

class SurpriseRequest(BaseModel):
    event_results: list
    user_tags: list
    meal_one: Optional[str] = None
    meal_two: Optional[str] = None
    meal_three: Optional[str] = None

@router.post("/surpriseme")
def handler(req: SurpriseRequest):
    event_results = req.event_results
    user_tags = req.user_tags
    meal_one = req.meal_one
    meal_two = req.meal_two
    meal_three = req.meal_three
    print(event_results, user_tags, meal_one, meal_two, meal_three)
    #parameters needed to schedule: start time, end time, user object
    #output: json object, array of events(in order)

    #1) fetch related events from database that fall within this timing
    try:
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
