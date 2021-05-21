import axios from "axios";
import store from "@/store";

const SERVER_URI = process.env.VUE_APP_SERVER_URI || "http://localhost:8888";

const api = axios.create({ baseURL: SERVER_URI });

const response_options = () => {
  const _id = store.getters.getUserID;
  return {
    headers: {
      Authorization: _id,
    },
  };
};

const uri = () => {
  return window.location.href;
};

export default {
  login() {
    window.location.href = `${SERVER_URI}/login?sw_redirect=${uri()}`;
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
    return api.get("/token", response_options()).then((response) => {
      store.commit("SET_ACCES_TOKEN", response.data);
    });
  },
  getUsersQuantity() {
    return api.get("/users").then((response) => response.data);
  },
  getListenersTop() {
    return api
      .get("/users/top", response_options())
      .then((response) => response.data);
  },
  getListeningHistory(page) {
    return api
      .get(`/listening-history?page=${page}`, response_options())
      .then((response) => response);
  },
  getOverview() {
    const fetchedData = (promise) => api.get(promise, response_options());
    const promises = ["/overview", "/top"].map(fetchedData);
    return Promise.all(promises).then((response) => response);
  },
  getAccount() {
    return api
      .get("/settings", response_options())
      .then((response) => response.data);
  },
  updateAccount(cred) {
    return api
      .post("/settings", cred, response_options())
      .then((response) => response.data);
  },
  getProfile(id) {
    return api
      .get(`/users/${id}`, response_options())
      .then((response) => response.data);
  },
  getTrack(id) {
    return api
      .get(`/track/${id}`, response_options())
      .then((response) => response.data);
  },
};
