import axios from 'axios';

export async function POST(request) {
  try {
    const { email, username } = await request.json();
    const USERS_API = process.env.NEXT_PUBLIC_USERS_API_BASE_ENDPOINT;
    
    const response = await axios.post(`${USERS_API}/signin/sso`, { 
      email, 
      username 
    });
    
    return Response.json(response.data);
  } catch (error) {
    console.error('Error in SSO signin:', error);
    return Response.json(
      error.response?.data || { message: 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}