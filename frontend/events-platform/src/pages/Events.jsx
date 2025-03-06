import React from "react";
import { useEffect, useState } from "react";
import { fetchEvents } from "../utils/eventbriteAPI";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      const eventData = await fetchEvents();
      console.log("Fetched events:", eventData);
      setEvents(eventData);
    };
    getEvents();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded shadow">
            <img
              src={event.logo.original.url}
              loading="loading"
              alt="Event Image"
            />
            <h3 className="text-lg font-semibold">{event.name.text}</h3>
            <p>
              {event.description.text?.slice(0, 100) ||
                "No description available."}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(event.start.local).toDateString()}
            </p>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              View Event
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
