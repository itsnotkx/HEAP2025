// app/api/events/route.js
import axios from 'axios';

export async function GET() {
  try {
    const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API_BASE_ENDPOINT;
    const response = await axios.get(`${EVENTS_API}/`);
    return Response.json(response.data);
  } catch (error) {
    console.error('Error fetching events:', error);
    return Response.json(
      error.response?.data || { message: 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request) {
  try {
    const eventData = await request.json();
    const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API_BASE_ENDPOINT;
    const response = await axios.post(`${EVENTS_API}/`, eventData);
    return Response.json(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json(
      error.response?.data || { message: 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}