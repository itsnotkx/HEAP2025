// app/api/distance/route.js
import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address1 = searchParams.get('address1');
    const address2 = searchParams.get('address2');
    const mode = searchParams.get('mode');
    
    const DIST_API = process.env.NEXT_PUBLIC_DISTANCE_API_BASE_ENDPOINT;
    
    if (!address1?.trim() || !address2?.trim()) {
      return Response.json({ 
        distance: null, 
        duration: null, 
        error: "Invalid addresses" 
      }, { status: 400 });
    }
    
    const response = await axios.get(DIST_API, {
      params: { address1, address2, mode }
    });
    
    return Response.json(response.data);
  } catch (error) {
    console.error('Error calculating distance:', error);
    return Response.json(
      error.response?.data || { message: 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}