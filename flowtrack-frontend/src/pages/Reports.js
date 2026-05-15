import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./Reports.css";

export default function Reports({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      // apiFetch returns JSON already in your project
      const res = await apiFetch("/reports/summary", { method: "GET" });
      setData(res);
    } catch (e) {
      setErr(e?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const summary = data?.summary;
  const recent = data?.recentAttendance || [];

  return (
    <div className="reports-page">
      <div className="reports-top">
        <button className="btn" onClick={onBack}>← Back</button>
        <h2>Reports</h2>
        <button className="btn" onClick={load} disabled={loading}>Refresh</button>
      </div>

      {loading ? (
        <div className="card">Loading...</div>
      ) : err ? (
        <div className="card error">{err}</div>
      ) : (
        <>
          <div className="grid">
            <div className="card">
              <div className="label">Date</div>
              <div className="value">{data?.dateKey}</div>
            </div>

            <div className="card">
              <div className="label">Total Check-ins Today</div>
              <div className="value">{summary?.totalCheckInsToday ?? 0}</div>
            </div>

            <div className="card">
              <div className="label">Total Check-outs Today</div>
              <div className="value">{summary?.totalCheckOutsToday ?? 0}</div>
            </div>

            <div className="card">
              <div className="label">Present Today</div>
              <div className="value">{summary?.presentToday ?? 0}</div>
            </div>

            {summary?.totalUsers !== null && summary?.totalUsers !== undefined && (
              <div className="card">
                <div className="label">Total Users (Admin)</div>
                <div className="value">{summary?.totalUsers ?? 0}</div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Recent Attendance (Today)</h3>
            {recent.length === 0 ? (
              <div className="muted">No records.</div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>UserId</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r._id}>
                        <td className="mono">{r.userId}</td>
                        <td>{r.checkInAt ? new Date(r.checkInAt).toLocaleTimeString() : "—"}</td>
                        <td>{r.checkOutAt ? new Date(r.checkOutAt).toLocaleTimeString() : "—"}</td>
                        <td>{r.status || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}