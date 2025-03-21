import axios from "axios";

const EVENTBRITE_ORG_ID = "2665518177771";
const EVENTBRITE_API_URL = `https://www.eventbriteapi.com/v3/organizations/${EVENTBRITE_ORG_ID}/events/`;

export const fetchEvents = async () => {
  try {
    const response = await axios.get(EVENTBRITE_API_URL, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_EVENTBRITE_API_KEY}`,
      },
      params: {
        expand: 'venue'
      }
    });

    return response.data.events;
  } catch (error) {
    console.error(
      "Error fetching Eventbrite events:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const createEventOnEventbrite = async (event) => {
  try {
    const formattedStartDate = new Date(event.date)
      .toISOString()
      .replace(/\.\d{3}/, "");
    const formattedEndDate = new Date(
      new Date(event.date).getTime() + 2 * 60 * 60 * 1000
    )
      .toISOString()
      .replace(/\.\d{3}/, "");

    const requestBody = {
      event: {
        name: { html: event.name },
        start: { timezone: "UTC", utc: formattedStartDate },
        end: { timezone: "UTC", utc: formattedEndDate },
        currency: "USD",
        online_event: false,
      },
    };

    console.log("Sending event to Eventbrite", requestBody);

    const response = await axios.post(EVENTBRITE_API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_EVENTBRITE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Event created Successfully:", response.data);
    return response.data.id;
  } catch (error) {
    console.error(
      "Error creating Eventbrite event:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const deleteEventFromEventbrite = async (eventbriteId) => {
  try {
    await axios.delete(
      `https://www.eventbriteapi.com/v3/events/${eventbriteId}/`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_EVENTBRITE_API_KEY}`,
        },
      }
    );
    return true;
  } catch (errr) {
    console.error(
      "Error deleting Eventbrite event:",
      error.response?.data || error.message
    );
    return false;
  }
};
