import axios from "axios";
import store from "@/store";
import { notifyAPI } from "@/notify.js";

const SERVER_URI = process.env.VUE_APP_SERVER_URI || "http://localhost:8888";

const api = axios.create({ baseURL: SERVER_URI, withCredentials: true });
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    notifyAPI.show({
      type: "danger",
      message: error?.response?.data?.message || "Something went wrong!",
    });
    return Promise.reject(error);
  }
);

export function redirect() {
  window.location.href = `${SERVER_URI}/login?sw_redirect=${window.location.href}`;
}
export function authorise(access_token) {
  return axios
    .get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => response.data);
}
export function getToken() {
  return api.get("/token").then((data) => {
    store.commit("SET_ACCES_TOKEN", data.token);
  });
}
export function getUsersQuantity() {
  return api.get("/users");
}
export function getListenersTop() {
  return api.get("/users/top");
}
export function getListeningHistory(page) {
  return api.get(`/listening-history?page=${page}`);
}
export function getOverview() {
  return api.get("/overview");
}
export function getTop() {
  return api.get("/top");
}
export function getAccount() {
  return api.get("/settings");
}
export function updateAccount(settings) {
  return api.post("/settings", settings);
}
export function getProfile(id) {
  return api.get(`/users/${id}`);
}
export function getTrack(id) {
  return api.get(`/track/${id}`);
}
