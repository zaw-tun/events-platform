import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

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
      } else {
        navigate("/events");
      }
    };

    checkUserRole();
  }, [navigate]);

  return userRole === "staff" ? (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Staff Dashboard</h2>
      <p>Welcome! You can manage events here.</p>
      {/* Add event creation and management features here */}
    </div>
  ) : null;
};

export default Admin;
