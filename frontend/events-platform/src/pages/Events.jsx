import React, { useEffect, useState } from "react";
import { fetchEvents } from "../utils/eventbriteAPI";
import { registerForEvent } from "../utils/firestore";
import { auth } from "../firebase/firebaseConfig";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        const eventData = await fetchEvents();
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
        setMessage("Failed to load events. Please try again later.");
      }
      setLoading(false);
    };
    getEvents();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async (event) => {
    if (!user) {
      setMessage("Please log in to register for events.");
      return;
    }

    const result = await registerForEvent(user.uid, event);
    setMessage(
      result.success ? "You are successfully registered!" : result.message
    );
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      {message && <p className="text-green-600">{message}</p>}
      {loading ? (
        <p className="text-center text-gray-600">Loading Events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-600">No events available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow">
              {event.logo && event.logo.original ? (
                <img
                  src={event.logo.original.url}
                  loading="loading"
                  alt="Event Image"
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-centre">
                  <span>No Image Available</span>
                </div>
              )}
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
              <button
                onClick={() => handleRegister(event)}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Register
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
