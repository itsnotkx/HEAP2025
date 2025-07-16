import json
import os
import requests

def lambda_handler(event, context):
    
    EC2_ENDPOINT = os.getenv("EC2_ENDPOINT")
    EC2_API_KEY = os.getenv("EC2_API_KEY")

    status = {}
    curr = 0
    
    try:
        events = event["result"]
        if not events:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "No events provided"})
            }
        for e in events:
            result = requests.post(
                EC2_ENDPOINT,
                headers={"Content-Type": "application/json"},
                data=json.dumps(e),
            )
        
        return {
            "statusCode":200,
        }

    except Exception as err:
        return {
                "statusCode": 400,
                "body": err
            }

