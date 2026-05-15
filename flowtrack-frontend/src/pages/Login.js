import React, { useState } from "react";
import { AuthAPI, setToken } from "../api";
import "../styles/app.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await AuthAPI.login(email, password);
      setToken(data.token);
      onLogin?.(data.user);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20, border: "1px solid #ddd" }}>
      <h2>FlowTrack Login</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            style={{ width: "100%", padding: 10 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@flowtrack.com"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            style={{ width: "100%", padding: 10 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
          />
        </div>

        {err ? <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div> : null}

        <button disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}