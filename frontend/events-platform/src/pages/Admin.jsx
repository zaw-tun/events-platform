import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  getDoc,
  doc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  fetchEvents,
  createEventOnEventbrite,
  deleteEventFromEventbrite,
} from "../utils/eventbriteAPI";

const Admin = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState({ name: "", venue: "", date: "" });

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "staff") {
        setUserRole("staff");
        fetchAllEvents();
      } else {
        navigate("/events");
      }
    };

    checkUserRole();
  }, [navigate]);

  const fetchAllEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);
      const firestoreEvents = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        source: "Firestore",
      }));

      const eventbriteEvents = await fetchEvents();
      const formattedEventbriteEvents = eventbriteEvents.map((event) => ({
        id: event.id,
        name: event.name.text,
        venue: event.venue ? event.venue.name : "Unknown",
        date: event.start.local,
        eventbriteId: event.id,
        source: "Eventbrite",
      }));

      setEvents([...firestoreEvents, ...formattedEventbriteEvents]);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventData.name || !eventData.venue || !eventData.date) {
      alert("Please fill in all fields");
      return;
    }

    const formattedDate = new Date(eventData.date);
    if (isNaN(formattedDate.getTime())) {
      alert("Invalid date format.");
      return;
    }

    const eventbriteEventId = await createEventOnEventbrite(eventData);
    if (!eventbriteEventId) {
      alert("Failed to create event on Eventbrite.");
      return;
    }

    await addDoc(collection(db, "events"), {
      ...eventData,
      eventbriteId: eventbriteEventId,
    });
    setEventData({ name: "", venue: "", date: "" });
    fetchAllEvents();
  };

  const handleDeleteEvent = async (eventId, eventbriteId, source) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    if (source === "Eventbrite" && eventbriteId) {
      const success = await deleteEventFromEventbrite(eventbriteId);
      if (!succes) {
        alert("Failed to delete from Eventbrite. Try again.");
        return;
      }
    }

    if (source === "Firestore") {
      await deleteDoc(doc(db, "events", eventId));
    }

    fetchAllEvents();
  };

  return userRole === "staff" ? (
    <div className="mt-2 bg-yellow-50 flex flex-col items-center justify-center h-screen w-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Staff Dashboard</h2>
      <p>Welcome! You can manage events here.</p>
      <form
        onSubmit={handleCreateEvent}
        className="mb-5 p-4 border rounded bg-white"
      >
        <h3 className="text-lg font-semibold mb-2s">Create New Event</h3>
        <input
          type="text"
          placeholder="Event Name"
          value={eventData.name}
          onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Venue"
          value={eventData.venue}
          onChange={(e) =>
            setEventData({ ...eventData, venue: e.target.value })
          }
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="datetime-local"
          value={eventData.date}
          onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          className="p-2 border rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Create Event
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2 text-black">Manage Events</h3>
      <table className="min-w-full bg-white border border-gray-300 text-orange-500">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Venue</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="border p-2">{event.name}</td>
              <td className="border p-2">{event.venue}</td>
              <td className="border p-2">
                {new Date(event.date).toLocaleString()}
              </td>
              <td className="border p-2">{event.source}</td>
              <td className="border p-2 flex justify-around">
                <button
                  onClick={() =>
                    handleDeleteEvent(
                      event.id,
                      event.eventbriteId,
                      event.source
                    )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;
};

export default Admin;
