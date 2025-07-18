// app/api/events/surpriseme/route.js
import axios from 'axios';

export async function POST(request) {
  try {
    const { event_results, user_tags } = await request.json();
    const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API_BASE_ENDPOINT;
    
    const response = await axios.post(`${EVENTS_API}/surpriseme`, {
      event_results,
      user_tags
    });
    
    return Response.json(response.data);
  } catch (error) {
    console.error('Error in surprise me API:', error);
    return Response.json(
      error.response?.data || { message: 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}