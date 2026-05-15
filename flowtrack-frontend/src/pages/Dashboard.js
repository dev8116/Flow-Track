import React, { useEffect, useState } from "react";
import { DashboardAPI, setToken } from "../api";
import "../styles/dashboard.css";

export default function Dashboard({ onLogout, onOpenAttendance, onOpenReports }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const d = await DashboardAPI.get();
        if (mounted) setData(d);
      } catch (e) {
        if (mounted) setErr(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  function logout() {
    setToken(null);
    onLogout?.();
  }

  if (loading) return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  if (err)
    return (
      <div style={{ padding: 20 }}>
        <h2>Dashboard</h2>
        <div style={{ color: "crimson" }}>{err}</div>
        <button onClick={logout} style={{ marginTop: 12 }}>Logout</button>
      </div>
    );

  const { user, stats, message } = data;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Dashboard</h2>
          <div style={{ opacity: 0.8 }}>{message}</div>
          <div style={{ fontSize: 13, opacity: 0.75 }}>
            {user.email} • role: {user.role}
          </div>
        </div>
        <button onClick={logout} style={{ padding: "10px 14px" }}>Logout</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
        <Card title="Projects" value={stats.totalProjects} />
        <Card title="Tasks" value={stats.totalTasks} />
        <Card title="Pending Leaves" value={stats.pendingLeaves} />
        <Card title="Attendance Today" value={stats.attendanceToday} />

        <button onClick={onOpenAttendance} style={{ padding: "10px 14px" }}>
          Attendance
        </button>

        <button onClick={onOpenReports} style={{ padding: "10px 14px" }}>
          Reports
        </button>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}