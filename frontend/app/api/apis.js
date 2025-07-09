import axios from 'axios';

// Assuming you use something like Vite or CRA and these env variables are exposed correctly
const USERS_API = process.env.USERS_API_BASE_ENDPOINT || 'http://localhost:8000/api/users';
const EVENTS_API = process.env.EVENTS_API_BASE_ENDPOINT || 'http://localhost:8000/api/events';

/**
 * 1) Sign in - POST /signin/traditional
 */
export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${USERS_API}/signin/traditional`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const ssoSignIn = async (email, username) => {
  try {
     const response = await axios.post(`${USERS_API}/signin/sso`, { email, username });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 2) Create account - POST /signup/traditional
 * @param {object} userData - 
 */
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${USERS_API}/signup/traditional`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 3) Fetch all events - GET /
 */
export const fetchAllEvents = async () => {
  try {
    const response = await axios.get(`${EVENTS_API}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 4) Create new event - POST /
 * @param {object} eventData
 */
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${EVENTS_API}/`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * 5) Fetch event by id - GET /{event_id}
 * @param {string|number} eventId
 */
export const fetchEventById = async (eventId) => {
  try {
    const response = await axios.get(`${EVENTS_API}/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const searchEventByKeyword = async (keyword, startdate, enddate) => {
  try {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (startdate) params.append("start_date", startdate);
    if (enddate) params.append("end_date", enddate);

    const response = await axios.get(`${EVENTS_API}/search/keyword`, {
      params: params
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};