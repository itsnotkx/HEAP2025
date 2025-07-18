// app/api/events/search/route.js
import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const user_id = searchParams.get('user_id');
    
    const EVENTS_API = process.env.NEXT_PUBLIC_EVENTS_API_BASE_ENDPOINT;
    
    const params = {};
    if (keyword) params.keyword = keyword;
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    if (user_id) params.user_id = user_id;

    const response = await axios.get(`${EVENTS_API}/search`, { params });
    return Response.json(response.data);
  } catch (error) {
    console.error('Error searching events:', error);
    return Response.json(
      error.response?.data || { message: 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}