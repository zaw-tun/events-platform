import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

export const registerForEvent = async (userId, event) => {
  try {
    const eventRef = doc(db, "users", userId, "registrations", event.id);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      return {
        success: false,
        message: "You are already registered for this event.",
      };
    }

    await setDoc(eventRef, {
      eventId: event.id,
      name: event.name.text,
      date: event.start.local,
      url: event.url,
      venue: {
        name: event.venue?.name || "TBD",
        address: event.venue?.address
          ? {
              address_1: event.venue.address.address_1 || "",
              city: event.venue.address.city || "",
              postal_code: event.venue.address.postal_code || "",
            }
          : null,
      },
      timestamp: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error registering for event:", error);
    return { success: false, error: error.message };
  }
};

export const cancelRegistration = async (userId, eventId) => {
  try {
    const eventRef = doc(db, "users", userId, "registrations", eventId);;
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return { success: false, error: error.message };
  }
};
