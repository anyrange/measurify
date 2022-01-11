import axios from "axios";
import $router from "@/router";
import { notify } from "@/services/notify";
import { useUserStore } from "@/stores/user";

const SERVER_URI = import.meta.env.VITE_SERVER_URI || "http://localhost:8888";

const api = axios.create({
  baseURL: SERVER_URI,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const user = useUserStore();
    if (error.response?.data?.status === 401) {
      user.logout();
    }
    if ($router.currentRoute.value.path !== "/") {
      notify.show({
        type: "danger",
        message: error?.response?.data?.message || "Something went wrong!",
      });
    }
    return Promise.reject(error);
  }
);

export function redirect() {
  window.location.href = `${SERVER_URI}/auth/login`;
}

export function getCurrentUser() {
  return api.get("/users/me");
}
export function logout() {
  return api.get("/auth/logout");
}
export function getAccount() {
  return api.get("/settings");
}
export function updateAccount(settings) {
  return api.post("/settings", settings);
}

export function getListenersTop() {
  return api.get("/users/top");
}

export function getProfile({
  username,
  rangeTop = 25,
  rangeGenres = 15,
  rangeHistory = 5,
}) {
  return api.get(`/users/${username}`, {
    params: {
      rangeTop,
      rangeGenres,
      rangeHistory,
    },
  });
}
export function getProfileReports({ username }) {
  return api.get(`/users/${username}/reports`);
}
export function getProfileCurrentTrack({ username }) {
  return api.get(`/users/${username}/player/currently-playing`);
}
export function getProfileListeningHistory({ username, page, range, search }) {
  return api.get(`/users/${username}/listening-history`, {
    params: {
      page,
      range,
      search,
    },
  });
}

export function getTrack(id) {
  return api.get(`/infopage/track/${id}`);
}
export function getArtist(id) {
  return api.get(`/infopage/artist/${id}`);
}
export function getAlbum(id) {
  return api.get(`/infopage/album/${id}`);
}

export function getFriends() {
  return api.get("/friends");
}
export function getTrackLyrics({ title, artist }) {
  return api.get("/lyrics", {
    params: {
      title,
      artist,
    },
  });
}
