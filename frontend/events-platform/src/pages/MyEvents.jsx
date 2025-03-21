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
        console.log(eventsList);
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
      <h2 className="text-2xl font-bold text-black mb-4">
        My Registered Events
      </h2>
      {events.length === 0 ? (
        <p>No events registered yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-orange-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Event Name</th>
                <th className="py-2 px-4 border">Venue</th>
                <th className="py-2 px-4 border">Start Date & Time</th>
                <th className="py-2 px-4 border">Event External Link</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index} className="border">
                  <td className="py-2 px-4 border">{event.name}</td>
                  <td className="py-2 px-4 border">
                    {event.venue || "Not available"}
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(event.date).toDateString()}
                  </td>

                  <td className="py-2 px-4 border">
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View Event
                    </a>
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => addToGoogleCalendar(event)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Add to Calendar
                    </button>
                    <button
                      onClick={() => addToGoogleCalendar(event)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
