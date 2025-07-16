import json
import os
import requests

def lambda_handler(event, context):
    # Extract address from input event
    address = event.get('address')
    if not address:
        return {
            'statusCode': 400,
            'body': json.dumps('Missing address parameter')
        }

    # Get API key from environment variable
    api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'body': json.dumps('Missing API key configuration')
        }

    # Call Google Geocoding API
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        'address': address,
        'key': api_key
    }
    
    try:
        response = requests.get(base_url, params=params)
        result = response.json()
        
        if result['status'] != 'OK':
            return {
                'statusCode': 400,
                'body': json.dumps(f"Geocoding error: {result['status']}")
            }
        
        # Extract first result
        location = result['results'][0]['geometry']['location']
        return {
            'statusCode': 200,
            'body': json.dumps({
                'latitude': location['lat'],
                'longitude': location['lng'],
                'formatted_address': result['results'][0]['formatted_address']
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }