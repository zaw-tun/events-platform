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
        console.log(eventData);
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
    console.log(event);
    setMessage(
      result.success ? "You are successfully registered!" : result.message
    );
  };

  return (
    <div className="min-h-screen bg-yellow-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Upcoming Events
        </h2>
        {message && <p className="text-green-600">{message}</p>}
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading Events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No events available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Event Image */}
                {event.logo && event.logo.original ? (
                  <img
                    src={event.logo.original.url}
                    alt={`${event.name.text} banner`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}

                {/* Event Details */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-orange-500 mb-2">
                    {event.name.text}
                  </h3>

                  {/* Venue Information */}
                  <div className="mb-3">
                    <p className="text-gray-700 font-medium">
                      <span className="font-semibold">Venue:</span>{" "}
                      {event.venue?.name || "TBD"}
                    </p>
                    {event.venue?.address && (
                      <p className="text-gray-600 text-sm">
                        {event.venue.address.address_1},{" "}
                        {event.venue.address.city},{" "}
                        {event.venue.address.postal_code}
                      </p>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="mb-3">
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(event.start.local).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Time:</span>{" "}
                      {new Date(event.start.local).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}{" "}
                      -{" "}
                      {new Date(event.end.local).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description.text?.slice(0, 150) ||
                      "No description available."}
                    {event.description.text?.length > 150 && "..."}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      More Details
                    </a>
                    <button
                      onClick={() => handleRegister(event)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
