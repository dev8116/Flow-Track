const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:5100/api";

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(path, { method = "GET", body } = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

export const AuthAPI = {
  login: (email, password) =>
    apiFetch("/auth/login", { method: "POST", body: { email, password } }),
  register: (payload) =>
    apiFetch("/auth/register", { method: "POST", body: payload }),
};

export const DashboardAPI = {
  get: () => apiFetch("/dashboard"),
};