![App Screenshot](frontend/public/KiasuPlanner.png)<hr>

[KiasuPlanner](https://heap-2025-kiasuplanner.vercel.app) is an intelligent, all-in-one event and itinerary planning platform designed to help users effortlessly build, optimize, and personalize their schedules. Whether planning a day out, managing multiple venues, or seeking "Surprise Me" event suggestions, KiasuPlanner leverages AI to reduce planning friction and maximize your enjoyment.

## Group Members

- KHOO KAR XING
- ETHAN LIM JIN
- WAI ZIN LIN
- MATTHEW KHOO LAY ROY
- EI CHAW ZIN

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structu
- re](#project-structure)
- [Core Functionalities](#core-functionalities)
- [License](#license)

---

## About

*KiasuPlanner* is built for the "kiasu" ones - those who stress and go through the hassle for the best experience. Let us help you out! With seamless frontend interactions, User-tailored event suggestions, real-time routing, and integrated mapping, KiasuPlanner transforms both solo and group itinerary planning.

**Platform Highlights:**
- Interactive day planner (easily rearrangeable, timeline, per-segment transit choice)
- "Surprise Me" for the adventurous
- Real-time travel time computations
- Secure user session and personalized suggestions

---

## Features

- <span style="color: #2EC4B6;"><b>User-Friendly Interface:</b></span> Interactive timeline sidebar and responsive design
- <span style="color: #FF6B6B;"><b>AI-Driven Event Suggestions:</b></span> Get automated recommendations with "Surprise Me"
- <span style="color: #FFD166;"><b>Per-Segment Transit Modes:</b></span> Choose transit, driving, cycling, or walking for each trip leg
- <span style="color: #232946;"><b>Route Optimization:</b></span> Dynamic travel time and distance using the Google Maps API
- <span style="color: #2EC4B6;"><b>Integrated Event Search:</b></span> Search events by keyword, date, or time window
- <span style="color: #FF6B6B;"><b>One-Click AWS Deployment:</b></span> Back-end is Dockerized for lightweight deployment
- <span style="color: #2EC4B6;"><b>Scalable FastAPI Backend:</b></span> Designed for rapid prototyping and easy extension

---

## Tech Stack

- **Frontend:** Next.js (React, TypeScript, TailwindCSS, HeroUI), NextAuth, Google Maps API, MUI, Vercel
- **Backend:** FastAPI (Python), Docker, AWS EC2
- **Database:** PostgreSql
- **Cloud/Infra:** AWS EC2, Docker, Vercel

---

## Project Structure
```
HEAP2025/
├── frontend/ # Next.js frontend server
├── backend/ # Shared React components
   ├── src/ # backend web server for serving the frontende
   ├── utils/ # Scripts for scrapers, classifier and database
```
---

## Core Functionalities

| Feature                | Description                                                         |
|------------------------|---------------------------------------------------------------------|
| <span style="color: #2EC4B6;">Timeline Sidebar</span>       | Add, reorder, and remove events; select transit per segment         |
| <span style="color: #FFD166;">Event Search</span>           | Find events by keyword, date, or filters                            |
| <span style="color: #FF6B6B;">AI "Surprise Me"</span>       | Smart suggestions for your day; tailored to your profile            |
| <span style="color: #232946;">Integrated Routing</span>     | Google Maps-powered travel time, real addresses, per-segment modes  |
| Dockerized Backend     | FastAPI server for scheduling, event, and suggestion APIs           |
| One-Click Deployment   | Rapid setup on AWS or any Docker host                               |

---

## Deployment instructions 
For the Backend Scrapers, as they are built to be serverless functions they should be deployed on the cloud using lambda.

## Enviroment Variables
### Webapp Backend:  
   ```DB_HOST```  
   ```DB_PORT=5432```  
   ```DB_NAME```  
   ```DB_USER```  
   ```DB_PASSWORD```  
   ```GOOGLE_MAPS_API_KEY```  

### Scraper Backend:  
   ```GOOGLE_MAPS_API_KEY```  

### Webapp Frontend:  
   ```GOOGLE_CLIENT_ID```  
   ```GOOGLE_CLIENT_SECRET```  
   ```NEXTAUTH_URL```  
   ```AUTH_SECRET```  
   ```GOOGLE_MAPS_API_KEY```  
   ```NEXT_PUBLIC_USERS_API_BASE_ENDPOINT={insert backend public hostname}/api/distance```  
   ```NEXT_PUBLIC_EVENTS_API_BASE_ENDPOINT={insert backend public hostname}/api/events```  
   ```NEXT_PUBLIC_DISTANCE_API_BASE_ENDPOINT={insert backend public hostname}/api/users```  


## Local
### Database
1) Create a PostgreSQL database in your local PostGreSQL database server.
2) Run the create statment backend/utils/database/crate.sql
3) Allow connections for database requests from both the scraper backend and the webapp backend.
   
### Webapp Backend: 
1) Set up a virtual environment and
  pip install -r requirements.txt
2) Run the following command:
  ```fastapi run```  

### Webapp Frontend:
1) In frontend/, run
   ```npm install```  
   ```npm run build```  
   ```npm start```  



## Deployment on Cloud
### Database
1) Create a PostgreSQL database in AWS RDS.
2) Run the create statment backend/utils/database/crate.sql
3) Allow connections for database requests from both the scraper backend and the webapp backend.

### Scraper Backend: 
1) Create a lambda function for STBScraper.py, TimeOutScraper.py, TheSmartLocalScraper.py, deduplication.py under backend/utils/lambda_functions. Fill up the environment variables as needed. include models.py in each of these lambda functions as well.
2) Create an AWS RDS instance. Run the create-insert script under backend/utils/database/createInsert.sql
3) Create a lambda function classifier-forwarder, under backend/utils/lambda_functions.
4) Create layers for the functions, as shown in backend/requirements.txt
5) Take psycopg2 from https://github.com/jkehler/awslambda-psycopg2 as pip install psycopg2 does not work with the Lambda image.
6) Create an EC2 instance. In this, place classifier.py. do remember to pip install -r requirements.txt. Within the ec2 instance, run the code using python3 classifier.py
7) For each scraper, ceate AWS Stepfunctions following this flow: Scraper -> deduplicator -> classifier-forwarder
8) For each Stepfunction, create an eventbridge event scheduling the database update.

### Webapp backend:
1) Go to AWS ec2, create an ec2 insrance. Configure it to be t2.micro with Amazon Linux as the image. Configure security group to allow port 80 and 22 inbound.
2) SSH into the isntance an run the following commands:
    ```sudo yum update -y```
    ```sudo yum install -y docker```
    ```sudo service docker start```
    ```sudo usermod -aG docker ec2-user```
    ```docker pull wzinl/kiasuplannerbackend```
    ```docker run -d -p 80:8000 wzinl/kiasuplannerbackend```

### Webapp Frontend:
1) Go to Vercel, create a new project, and set root directory to be /frontend.
2) Set the build command to be ```npm run build```, and the install command to be ```npm install```
3) Set the environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_EVENTS_API_BASE_ENDPOINT, NEXT_PUBLIC_DISTANCE_API_BASE_ENDPOINT, NEXT_PUBLIC_USERS_API_BASE_ENDPOINT
4) Deploy the webapp.

## License

KiasuPlanner is distributed under the MIT License.

---

**Repository:**  
[https://github.com/itsnotkx/HEAP2025](https://github.com/itsnotkx/HEAP2025)
