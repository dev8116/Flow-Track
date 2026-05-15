import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports"; // ✅ NEW
import { getToken } from "./api";
import "./styles/app.css";

export default function App() {
  const [isAuthed, setIsAuthed] = useState(!!getToken());
  const [page, setPage] = useState("dashboard");

  if (!isAuthed) {
    return <Login onLogin={() => { setIsAuthed(true); setPage("dashboard"); }} />;
  }

  if (page === "attendance") {
    return <Attendance onBack={() => setPage("dashboard")} />;
  }

  if (page === "reports") {
    return <Reports onBack={() => setPage("dashboard")} />;
  }

  return (
    <Dashboard
      onLogout={() => { setIsAuthed(false); }}
      onOpenAttendance={() => setPage("attendance")}
      onOpenReports={() => setPage("reports")} // ✅ NEW
    />
  );
}