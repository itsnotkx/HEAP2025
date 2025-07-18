// app/api/events/[eventId]/route.js
import axios from 'axios';

export async function GET(request, { params }) {
  try {
    const { eventId } = params;
    const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API_BASE_ENDPOINT;
    
    const response = await axios.get(`${EVENTS_API}/${eventId}`);
    return Response.json(response.data);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return Response.json(
      error.response?.data || { message: 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}