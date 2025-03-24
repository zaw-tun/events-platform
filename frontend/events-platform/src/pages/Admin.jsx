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
  const [eventData, setEventData] = useState({
    name: "",
    venue: { name: "", address: { address_1: "", city: "", postal_code: "" } },
    date: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});

  useEffect(() => {
    const checkUserRole = async () => {
      try {
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
      } catch (err) {
        console.error("Error in checkUserRole:", err);
        setError("Failed to load user role. Please try again.");
      }
    };

    checkUserRole();
  }, [navigate]);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    try {
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);
      const firestoreEvents = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        venue: doc.data().venue?.name || "Unknown",
        venueAddress: doc.data().venue?.address || "N/A",

        date: doc.data().date,
        eventbriteId: doc.data().eventbriteId,
        source: "Firestore",
      }));

      const eventbriteEvents = await fetchEvents();
      const formattedEventbriteEvents = eventbriteEvents.map((event) => ({
        id: event.id,
        name: event.name.text,
        venue:
          event.venue?.name ||
          (event.venue_id ? "Venue ID: " + event.venue_id : "Not Assigned"),
        venueAddress: event.venue?.address?.localized_address_display || "N/A",
        date: event.start.local,
        eventbriteId: event.id,
        source: "Eventbrite",
      }));

      setEvents([...firestoreEvents, ...formattedEventbriteEvents]);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (!eventData.name || !eventData.venue || !eventData.date) {
        alert("Please fill in all fields");
        return;
      }

      const formattedDate = new Date(eventData.date);
      if (isNaN(formattedDate.getTime())) {
        alert("Invalid date format.");
        return;
      }

      const result = await createEventOnEventbrite(eventData);
      if (!result || !result.eventId) {
        alert("Failed to create event on Eventbrite.");
        return;
      }

      const { eventId, venue } = result;

      await addDoc(collection(db, "events"), {
        name: eventData.name,
        venue: venue,
        date: eventData.date,
        eventbriteId: eventId,
      });
      setEventData({
        name: "",
        venue: {
          name: "",
          address: { address_1: "", city: "", postal_code: "" },
        },
        date: "",
      });
      await fetchAllEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create event. Please check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteEvent = async (eventId, eventbriteId, source) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting((prev) => ({ ...prev, [eventId]: true }));
    try {
      if (source === "Eventbrite" && eventbriteId) {
        const success = await deleteEventFromEventbrite(eventbriteId);
        if (!success) {
          alert("Failed to delete from Eventbrite. Try again.");
          return;
        }
      }

      if (source === "Firestore") {
        await deleteDoc(doc(db, "events", eventId));
      }

      await fetchAllEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return userRole === "staff" ? (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Staff Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage your events with ease</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Event Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Create New Event
              </h3>
              <form onSubmit={handleCreateEvent}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={eventData.name}
                    onChange={(e) =>
                      setEventData({ ...eventData, name: e.target.value })
                    }
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    placeholder="Venue Name"
                    value={eventData.venue.name}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        venue: { ...eventData.venue, name: e.target.value },
                      })
                    }
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={eventData.venue.address.address_1}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        venue: {
                          ...eventData.venue,
                          address: {
                            ...eventData.venue.address,
                            address_1: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    placeholder="City/Town"
                    value={eventData.venue.address.city}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        venue: {
                          ...eventData.venue,
                          address: {
                            ...eventData.venue.address,
                            city: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={eventData.venue.address.postal_code}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        venue: {
                          ...eventData.venue,
                          address: {
                            ...eventData.venue.address,
                            postal_code: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <input
                    type="datetime-local"
                    value={eventData.date}
                    onChange={(e) =>
                      setEventData({ ...eventData, date: e.target.value })
                    }
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    className={`w-full p-3 bg-blue-600 text-white rounded-md transition-colors ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Events Table */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Manage Events
              </h3>
              {isLoading ? (
                <div className="flex justify-center items-center py-6">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                      className="opacity-75"
                    />
                  </svg>
                  <span className="ml-2 text-gray-600">Loading events...</span>
                </div>
              ) : events.length === 0 ? (
                <p className="text-gray-600 text-center py-6">
                  No events available
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          Venue
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          Venue Address
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          Source
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr
                          key={event.id}
                          className="border-t hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-800">
                            {event.name}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {event.venue}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {event.venueAddress}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {new Date(event.date).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-800">
                            {event.source}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() =>
                                handleDeleteEvent(
                                  event.id,
                                  event.eventbriteId,
                                  event.source
                                )
                              }
                              className={`px-3 py-1 rounded-md text-white transition-colors ${
                                isDeleting[event.id]
                                  ? "bg-red-300 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-600"
                              }`}
                              disabled={isDeleting[event.id]}
                            >
                              {isDeleting[event.id] ? (
                                <span className="flex items-center">
                                  <svg
                                    className="animate-spin h-4 w-4 mr-2 text-white"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                      className="opacity-25"
                                    />
                                    <path
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                                      className="opacity-75"
                                    />
                                  </svg>
                                  Deleting...
                                </span>
                              ) : (
                                "Delete"
                              )}
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
      </div>
    </div>
  ) : null;
};

export default Admin;
