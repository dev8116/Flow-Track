import React, { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api/attendance";

function fmt(dt) {
  if (!dt) return "--";
  return new Date(dt).toLocaleString();
}

export default function Attendance({ onBack }) {
  // TEMP: use fixed id; replace with your real logged-in user id later
  const userId = useMemo(() => localStorage.getItem("userId") || "000000000000000000000001", []);

  const [loading, setLoading] = useState(false);
  const [dateKey, setDateKey] = useState("");
  const [attendance, setAttendance] = useState(null);

  async function loadToday() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/today`, { headers: { "x-user-id": userId } });
      const data = await res.json();
      setDateKey(data.dateKey);
      setAttendance(data.attendance);
    } finally {
      setLoading(false);
    }
  }

  async function checkIn() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/checkin`, { method: "POST", headers: { "x-user-id": userId } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Check-in failed");
      setAttendance(data.attendance);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkOut() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/checkout`, { method: "POST", headers: { "x-user-id": userId } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Check-out failed");
      setAttendance(data.attendance);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadToday();
    // eslint-disable-next-line
  }, []);

  const checkedIn = !!attendance?.checkInAt;
  const checkedOut = !!attendance?.checkOutAt;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Attendance</h2>
        <button onClick={onBack}>Back</button>
      </div>

      <p style={{ color: "#666" }}>Today: <b>{dateKey || "--"}</b></p>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={box}>
          <div style={label}>Check In</div>
          <div style={value}>{fmt(attendance?.checkInAt)}</div>
        </div>

        <div style={box}>
          <div style={label}>Check Out</div>
          <div style={value}>{fmt(attendance?.checkOutAt)}</div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button disabled={loading || checkedIn} onClick={checkIn} style={btnBlue}>
          Check In
        </button>
        <button disabled={loading || !checkedIn || checkedOut} onClick={checkOut} style={btnDark}>
          Check Out
        </button>
      </div>

      <small style={{ display: "block", marginTop: 10, color: "#777" }}>
        Demo uses <code>x-user-id</code> header. Later connect this to your JWT login user.
      </small>
    </div>
  );
}

const box = { flex: 1, border: "1px solid #ddd", borderRadius: 10, padding: 12, background: "#fafafa" };
const label = { fontSize: 12, color: "#777" };
const value = { fontSize: 14, fontWeight: 700 };
const btnBlue = { padding: "10px 14px", borderRadius: 10, border: "none", background: "#2563eb", color: "white" };
const btnDark = { padding: "10px 14px", borderRadius: 10, border: "none", background: "#111827", color: "white" };