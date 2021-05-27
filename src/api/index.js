import axios from "axios";
import store from "@/store";

const SERVER_URI = process.env.VUE_APP_SERVER_URI || "http://localhost:8888";

const api = axios.create({ baseURL: SERVER_URI, withCredentials: true });
api.interceptors.response.use((response) => response.data);

export default {
  login() {
    window.location.href = `${SERVER_URI}/login?sw_redirect=${window.location.href}`;
  },
  authorise(access_token) {
    return axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      .then((response) => response.data);
  },
  getToken() {
    return api.get("/token").then((data) => {
      store.commit("SET_ACCES_TOKEN", data);
    });
  },
  getUsersQuantity() {
    return api.get("/users");
  },
  getListenersTop() {
    return api.get("/users/top");
  },
  getListeningHistory(page) {
    return api.get(`/listening-history?page=${page}`);
  },
  getOverview() {
    return api.get("/overview");
  },
  getTop() {
    return api.get("/top");
  },
  getAccount() {
    return api.get("/settings");
  },
  updateAccount(settings) {
    return api.post("/settings", settings);
  },
  getProfile(id) {
    return api.get(`/users/${id}`);
  },
  getTrack(id) {
    return api.get(`/track/${id}`);
  },
};
