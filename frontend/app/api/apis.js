import axios from 'axios';

const USERS_API = process.env.USERS_API_BASE_ENDPOINT || 'http://localhost:8000/api/users';
const EVENTS_API = process.env.EVENTS_API_BASE_ENDPOINT || 'http://localhost:8000/api/events';
const DIST_API = process.env.DISTANCE_API_BASE_ENDPOINT || 'http://localhost:8000/api/distance/';

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

export const saveDay = async(eventsArray) => {

}

export const ssoSignIn = async (email, username) => {
  try {
    const response = await axios.post(`${USERS_API}/signin/sso`, { email, username });
    console.log("response.data:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error in ssoSignIn:", error);
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

/*
6) Gives the distance between two addresses
*/
export const getDistanceBetweenVenues = async (address1, address2, mode = "Transit") => {
  try {
    // address1 = encodeURIComponent(address1);
    // address2 = encodeURIComponent(address2);
    const response = await axios.get(DIST_API, {
      params: { address1, address2, mode },
    });
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const search = async (keyword, start_date, end_date, user_id) => {
  try {
    const params = {};

    if (keyword) params.keyword = keyword;
    if (start_date) params.start_date = start_date.toString();
    if (end_date) params.end_date = end_date.toString();
    if (user_id) params.user_id = user_id;

    const response = await axios.get(`${EVENTS_API}/search`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export async function fetchSurpriseMe({ formData, user_id, user_preferences }) {
  try {
    const { date, startTime, endTime } = formData;

    const starttime = new Date(`${date}T${startTime}`);
    const endtime = new Date(`${date}T${endTime}`);

    const startISO = starttime.toISOString();
    const endISO = endtime.toISOString();

    // Call your search API
    const events = await search(null, startISO, endISO, user_id);

    const response = await axios.post(`${EVENTS_API}/surpriseme`, {
      event_results: events,
      user_tags: user_preferences
    });

    if (response.status === 200) {
      console.log("response data---------");
      console.log(response.data);
      return response.data;
    } else {
      console.log("skill issue!");
      return response.data;
    }

  } catch (error) {
    console.error('Error fetching surprise:', error);
    throw error.response?.data || error;
  }
}
