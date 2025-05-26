import os
import requests

api_key = os.getenv("STB_API_KEY")

url = "https://api.stb.gov.sg/content/events/v2/search"

headers = {
    "apikey": api_key,
    "Accept": "application/json"
}

params = {
    "searchType": "keyword",
    "searchValues": '["music"]',
    "limit": 1,
    "offset": 0
}

response = requests.get(url, headers=headers, params=params)

print(response.status_code)
print(response.text)
