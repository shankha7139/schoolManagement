// src/components/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [selectedOption, setSelectedOption] = useState("students");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("students")) {
      setSelectedOption("students");
    } else if (path.includes("teachers")) {
      setSelectedOption("teachers");
    } else if (path.includes("my-info")) {
      setSelectedOption("my-info");
    }
  }, [location]);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/admin/students"
                className={`block p-2 rounded ${
                  selectedOption === "students" ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedOption("students")}
              >
                All Students
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/teachers"
                className={`block p-2 rounded ${
                  selectedOption === "teachers" ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedOption("teachers")}
              >
                All Teachers
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/my-info"
                className={`block p-2 rounded ${
                  selectedOption === "my-info" ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedOption("my-info")}
              >
                My Info
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="block p-2 rounded"
                onClick={() => setSelectedOption("logout")}
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
