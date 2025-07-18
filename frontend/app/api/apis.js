import axios from 'axios';

export const ssoSignIn = async (email, username) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_USERS_API_BASE_ENDPOINT}/signin/sso`, { email, username });
    console.log("response.data:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error in ssoSignIn:", error);
    throw error.response?.data || error;
  }
};

/**
 * 3) Fetch all events - GET /
 */
export const fetchAllEvents = async () => {
  try {
    const response = await axios.get('/api/events');
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
    const response = await axios.post('/api/events', eventData);
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/events/${eventId}`, {
      cache: 'no-store', // or 'force-cache' depending on your use case
    });
    if (!res.ok) throw new Error(`Failed to fetch event ${eventId}`);
    return res.json();
  } catch (error) {
    console.error('fetchEventById error:', error);
    throw error;
  }
};


/*
6) Gives the distance between two addresses
*/
export const getDistanceBetweenVenues = async (address1, address2, mode = "Transit") => {
  try {
    if (!address1?.trim() || !address2?.trim()) {
      return { distance: null, duration: null, error: "Invalid addresses" };
    }
    
    const response = await axios.get('/api/distance', {
      params: { address1, address2, mode: mode.toLowerCase() },
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

    const response = await axios.get('/api/events/search', {
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

    // Convert to ISO strings like "2025-07-15T08:00:00"
    const startISO = starttime.toISOString();
    const endISO = endtime.toISOString();

    // Call your search API
    const events = await search(null, startISO, endISO, user_id);

    const response = await axios.post('/api/events/surpriseme', {
      event_results: events,
      user_tags: user_preferences,
    });

    console.log('Surprise API response data:', response.data);

    if (response.status === 200 && response.data.result) {
      try {
        return JSON.parse(response.data.result);
      } catch (parseError) {
        console.error('Failed parsing surprise result JSON:', parseError, response.data.result);
        throw parseError;
      }
    }

    console.error('Unexpected response:', response);
    throw new Error('Failed to fetch surprise');
  } catch (error) {
    console.error('Error fetching surprise:', error);
    throw error.response?.data || error;
  }
}