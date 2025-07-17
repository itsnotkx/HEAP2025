# KiasuPlanner – HEAP2025

*KiasuPlanner* is an intelligent, all-in-one event and itinerary planning platform designed to help users effortlessly build, optimize, and personalize their schedules. Whether planning a day out, managing multiple venues, or seeking "Surprise Me" event suggestions, KiasuPlanner leverages AI to reduce planning friction and maximize your enjoyment.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Functionalities](#core-functionalities)
- [License](#license)

---

## About

*KiasuPlanner* is built for the "kiasu" ones — those who stress and go through the hassle for the best experience. Let us help you out! With seamless frontend interactions, AI-driven event suggestions, real-time routing, and integrated mapping/ticketing, KiasuPlanner transforms both solo and group itinerary planning.

**Platform Highlights:**
- Interactive day planner (easily rearrangeable, timeline, per-segment transit choice)
- AI "Surprise Me" for smart event stacks
- Real-time travel time computations (Google Maps API)
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

- **Frontend:** Next.js (React, TypeScript, TailwindCSS, HeroUI), NextAuth, Google Maps API, MUI, Vercel (deployed frontend)
- **Backend:** FastAPI (Python), Docker, AWS EC2
- **Database:** (as defined in backend Docker image)
- **Cloud/Infra:** AWS EC2, Docker, Vercel

---

## Project Structure
```
HEAP2025/
├── app/ # Next.js frontend source
├── components/ # Shared React components
├── styles/ # CSS/global styles – see variables for colour palette
├── backend/ # FastAPI backend (Dockerized)
├── types/ # Shared TypeScript types
├── .env.example # Environment variable template
└── README.md # Project docs (this file)
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

## License

KiasuPlanner is distributed under the MIT License.

---

**Repository:**  
[https://github.com/itsnotkx/HEAP2025](https://github.com/itsnotkx/HEAP2025)
