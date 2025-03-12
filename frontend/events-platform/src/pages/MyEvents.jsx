import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const eventsRef = collection(
          db,
          "users",
          currentUser.uid,
          "registrations"
        );
        const eventsSnap = await getDocs(eventsRef);
        const eventsList = eventsSnap.docs.map((doc) => doc.data());
        setEvents(eventsList);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToGoogleCalendar = (event) => {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name
    )}&dates=${event.date.replace(/[-:]/g, "")}/${event.date.replace(
      /[-:]/g,
      ""
    )}&details=${encodeURIComponent(event.url)}&location=&sf=true&output=xml`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="mt-2 bg-yellow-50 flex flex-col items-center justify-center h-screen w-screen p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        My Registered Events
      </h2>
      {events.length === 0 ? (
        <p>No events registered yet.</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index} className="border p-4 rounded shadow mb-2">
              <h3 className="text-lg text-orange-500 font-semibold">{event.name}</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toDateString()}
              </p>
              <div className="flex justify-between items-center mt-2">
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  View Event
                </a>
                <button
                  onClick={() => addToGoogleCalendar(event)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add to Calendar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyEvents;
