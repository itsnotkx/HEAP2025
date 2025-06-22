import os
import psycopg2
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpBinary
from datetime import datetime, timedelta

def fetchTravelTimes(addr1, addr2):
    #query google maps api for travel times between addr1 and addr2
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
        
        results_score_map = generate_score_map(event_results, user_tags)

        #now, we use knapsack algorithm to maximise score while fitting as many events as possible within the allocated time brackets.
        #key constraint: event timeslots CANNOT overlap
        #TODO: finish ILP algorithm
        

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
