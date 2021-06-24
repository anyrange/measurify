import axios from "axios";
import $store from "@/store";
import $router from "@/router";
import { notifyAPI } from "@/notify.js";

const SERVER_URI = process.env.VUE_APP_SERVER_URI || "http://localhost:8888";

const api = axios.create({ baseURL: SERVER_URI, withCredentials: true });
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.data.status === 401) $store.dispatch("logout");
    if ($router.currentRoute.value.path === "/") return;
    notifyAPI.show({
      type: "danger",
      message: error.response.data.message || "Something went wrong!",
    });
    return Promise.reject(error);
  }
);

export function redirect() {
  const url = location.protocol + "//" + location.host + location.pathname;
  window.location.href = `${SERVER_URI}/auth/login?sw_redirect=${url}`;
}
export function getCurrentUser() {
  return api.get("/users/current");
}
export function getUsersQuantity() {
  return api.get("/users");
}
export function getListenersTop() {
  return api.get("/users/top");
}
export function getListeningHistory({ query, page }) {
  return api.get(`/listening-history?search=${query}&page=${page}`);
}
export function getOverview() {
  return api.get("/overview");
}
export function getTop() {
  return api.get("/top");
}
export function deauthorize() {
  return api.get("/auth/logout");
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
export function getArtist(id) {
  return api.get(`/artist/${id}`);
}
export function getAlbum(id) {
  return api.get(`/album/${id}`);
}
export function getFriends() {
  return api.get("/friends");
}
