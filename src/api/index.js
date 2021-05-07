import axios from "axios";
import store from "@/store";

const url = process.env.VUE_APP_SERVER_URI || "http://localhost:8888";

const response_options = () => {
  const _id = store.getters.getUserID;
  return {
    headers: {
      Authorization: _id,
    },
  };
};

export default {
  login() {
    window.location.href = `${url}/login`;
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
    return axios.get(`${url}/token`, response_options()).then((response) => {
      store.commit("SET_ACCES_TOKEN", response.data);
    });
  },
  getUsersQuantity() {
    return axios.get(`${url}/users`).then((response) => response.data);
  },
  getListenersTop() {
    return axios
      .get(`${url}/users/top`, response_options())
      .then((response) => response.data);
  },
  getListeningHistory(page) {
    return axios
      .get(`${url}/listening-history?page=${page}`, response_options())
      .then((response) => response);
  },
  getOverview() {
    const fetchedData = (promise) => axios.get(promise, response_options());
    const promises = [`${url}/overview`, `${url}/top`].map(fetchedData);
    return Promise.all(promises).then((response) => response);
  },
  getAccount() {
    return axios
      .get(`${url}/settings`, response_options())
      .then((response) => response.data);
  },
  updateAccount(cred) {
    return axios
      .post(`${url}/settings`, cred, response_options())
      .then((response) => response.data);
  },
  getProfile(id) {
    return axios
      .get(`${url}/user/${id}`, response_options())
      .then((response) => response.data);
  },
  getTrack(id) {
    return axios
      .get(`${url}/track/${id}`, response_options())
      .then((response) => response.data);
  },
};
