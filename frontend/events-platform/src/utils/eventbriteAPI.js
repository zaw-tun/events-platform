import axios from "axios";

const EVENTBRITE_ORG_ID = "2665518177771"; 
const EVENTBRITE_API_URL = `https://www.eventbriteapi.com/v3/organizations/${EVENTBRITE_ORG_ID}/events/`;

export const fetchEvents = async () => {
  try {
    const response = await axios.get(EVENTBRITE_API_URL, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_EVENTBRITE_API_KEY}`,
      },
    });

    return response.data.events;
  } catch (error) {
    console.error("Error fetching Eventbrite events:", error.response?.data || error.message);
    return [];
  }
};
