import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_URL } from "../config";

function login(data: { username: string; password: string }): Promise<any> {
  return axios.post(LOGIN_URL, data).then(response => {
    window.localStorage.setItem("authToken", response.data.token);
    axios.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;

    return jwtDecode(response.data.token);
  });
}

function logout(): void {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

function load(): void {
  const token: string | null = window.localStorage.getItem("authToken");
  if (token) {
    const { exp } = jwtDecode(token);
    if (exp > new Date().getTime() / 1000) {
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
  }
}

function isAuthenticated(): boolean {
  const token: string | null = window.localStorage.getItem("authToken");
  if (token) {
    const { exp } = jwtDecode(token);
    if (exp > new Date().getTime() / 1000) {
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  }
  return false;
}

function getUserData(): any {
  const token: string | null = window.localStorage.getItem("authToken");
  if (token) {
    const { exp, id, username, roles, avatar } = jwtDecode(token);
    if (exp > new Date().getTime() / 1000) {
      return { id, username, roles, avatar };
    }
  }
}

export default { load, isAuthenticated, login, logout, getUserData };
