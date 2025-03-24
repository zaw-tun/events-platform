import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { cancelRegistration } from "../utils/firestore";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserEvents(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserEvents = async (uid) => {
    const eventsRef = collection(db, "users", uid, "registrations");
    const eventsSnap = await getDocs(eventsRef);
    const updatedEvents = eventsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(updatedEvents);
    console.log(updatedEvents);
  };

  const addToGoogleCalendar = (event) => {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name
    )}&dates=${event.date.replace(/[-:]/g, "")}/${event.date.replace(
      /[-:]/g,
      ""
    )}&details=${encodeURIComponent(event.url)}&location=&sf=true&output=xml`;
    window.open(googleCalendarUrl, "_blank");
  };

  const handleCancel = async (eventId) => {
    const user = auth.currentUser;
    if (!user) return;

    const result = await cancelRegistration(user.uid, eventId);
    if (result.success) {
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setMessage("Registration cancelled.");
    } else {
      setMessage("Failed to cancel registration. Try again.");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            My Registered Events
          </h2>
          <p className="text-gray-600 mt-2">Manage your event registrations</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {events.length === 0 ? (
            <p className="text-gray-600 text-center py-6">
              No events registered yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Event Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Venue
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Start Date & Time
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Event Link
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-800">{event.name}</td>
                      <td className="py-3 px-4 text-gray-800">
                        {event.venue || "Not available"}
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        {new Date(event.date).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Event
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => addToGoogleCalendar(event)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2"
                        >
                          Add to Calendar
                        </button>

                        <button
                          onClick={() => handleCancel(event.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
      </div>
    </div>
  );
};

export default MyEvents;
