# Events Platform
Events Platform is a React.js application built with Vite that allows staff users to create, manage, and delete events synced with Eventbrite and stored in Firebase Firestore. The platform includes Firebase Authentication for secure user and staff access, integrates with the Eventbrite API for event management, and provides a clean interface for event administration. Key features include creating events with descriptions and images (WIP), viewing events from both Firestore and Eventbrite, and deleting events with proper synchronization.

https://zawtun-events.netlify.app/

# 🚀 Features
- 🔑 Firebase Authentication: Secure login for staff users (Email/Password).
- 🎫 Eventbrite Integration: Create, fetch, and delete events via the Eventbrite API.
- 📊 Firestore Storage: Store event details (name, venue, date, description, image file name) in Firebase Firestore.
- 🖼️ Image Upload: Support for uploading event images to Eventbrite (currently in progress due to API issues).
- 🗑️ Event Management: Delete events with synchronization between Firestore and Eventbrite.
- 📱 Responsive Design: Built with Tailwind CSS for a modern, accessible UI.

# 🛠️ Tech Stack
- Frontend: React.js (Vite, Tailwind CSS)
- Authentication: Firebase Auth
- Database: Firebase Firestore
- API: Eventbrite API
- Routing: React Router (assumed based on navigation in Admin.jsx)

# 🔑 Test Account Access Details
To test the application locally or on the deployed version (once available), use the following credentials:

Email: zaw12un@gmail.com

Password: 123456

Role: Staff (required for access to the admin dashboard)

Note: These credentials should be set up in your Firebase Authentication console under "Users" with the role: "staff" attribute added to the corresponding Firestore users document (e.g., users/<uid>).

# 🔧 Installation & Setup to Run the Project Locally
Follow these steps to run the Events Platform locally:

1️⃣ Clone the Repository

git clone https://github.com/zaw-tun/events-platform.git
cd events-platform

2️⃣ Install Dependencies

npm install
<This installs required packages like react, firebase, axios, and tailwindcss.>

3️⃣ Set Up Firebase

This app uses Firebase for authentication and Firestore. Configure it as follows:

Create a Firebase Project:

Go to the Firebase Console.
Click "Add project", name it (e.g., "Events Platform"), and complete the setup.

Enable Authentication:

In the sidebar, go to Authentication > Sign-in method.
Enable Email/Password provider and save.

Set Up Firestore:

In the sidebar, go to Firestore Database > Create database.
Choose "Start in test mode" (for development) and select a region.

Add a Test User:

In Authentication > Users, add a user with:
Email: test.staff@example.com
Password: Test1234!
In Firestore > users/<uid>, add a document with { role: "staff" }.

Copy Firebase Config:
Go to Project Settings > General > Your apps.
Add a web app, copy the firebaseConfig object.

Update firebaseConfig.js:
Open src/firebase/firebaseConfig.js (create if missing) and update:
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

4️⃣ Set Up Environment Variables

Create a .env file in the project root and add:

VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
VITE_EVENTBRITE_API_KEY="YOUR_EVENTBRITE_API_KEY"
Replace values with your Firebase config and Eventbrite API key.
Get Eventbrite API Key:
Log in to Eventbrite.
Go to Developer Portal > API Keys, create a key, and copy it.


Add .env to .gitignore:

echo ".env" >> .gitignore


5️⃣ Add Netlify Redirects (Optional for Local Testing)**
For SPA routing (needed for deployment, not local):

Create public/_redirects:
echo "/* /index.html 200" > public/_redirects


6️⃣ Run the Project

npm run dev
The app will run at http://localhost:5173/.
Log in with the test credentials to access the admin dashboard.

# Node Version Required
v>=18.0.0


# 📝 Notes

Image Upload: The Eventbrite image upload feature is currently WIP due to API errors (crop_mask - INVALID). Basic event creation works without images.
