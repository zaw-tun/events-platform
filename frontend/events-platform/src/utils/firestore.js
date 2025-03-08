import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
      timestamp: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error registering for event:", error);
    return { success: false, error: error.message };
  }
};
