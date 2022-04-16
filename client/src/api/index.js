import axios from "axios";
import router from "@/router";
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
    if (error.response.status === 401) {
      router.push("/");
      user.logout();
      notify.show({
        type: "danger",
        message: error.response?.data?.message || "Something went wrong!",
      });
    }
    return Promise.reject(error);
  }
);

export function login() {
  window.location.href = `${SERVER_URI}/auth/login`;
}

export function getStats() {
  return api.get("/info/stats");
}
export function getFeed(page = 1, limit = 20) {
  return api.get("/info/feed", { params: { page, limit } });
}

export function checkAuthorization() {
  return api.get("/auth/check");
}
export function logout() {
  return api.get("/auth/logout");
}

export function getCurrentUser() {
  return api.get("/users/me");
}
export function deleteAccount() {
  return api.delete("/users/me");
}
export function getListenersTop() {
  return api.get("/users/top");
}
export function getProfileCurrentTrack({ username }) {
  return api.get(`/users/${username}/player/currently-playing`);
}
export function getProfile({ username, rangeTop, rangeGenres, rangeHistory }) {
  return api.get(`/users/${username}`, {
    params: {
      rangeTop: rangeTop || 25,
      rangeGenres: rangeGenres || 15,
      rangeHistory: rangeHistory || 5,
    },
  });
}
export function getProfileReports({ username }) {
  return api.get(`/users/${username}/reports`);
}
export function getProfileTimelineReport({ username, options }) {
  return api.get(`/users/${username}/reports/graph`, {
    params: { ...options },
  });
}
export function getProfileActivityReport({ username, options }) {
  return api.get(`/users/${username}/reports/hourly-activity`, {
    params: { ...options },
  });
}
export function getProfileGenresReport({ username, options }) {
  return api.get(`/users/${username}/reports/genres-timeline`, {
    params: {
      ...options,
    },
  });
}
export function getProfileListeningHistory({ username, page, range, search }) {
  return api.get(`/users/${username}/listening-history`, {
    params: { page, range, search },
  });
}
export function getProfileAlbumsLibrary({ username, page, range, search }) {
  return api.get(`/users/${username}/library/albums`, {
    params: { page, range, search },
  });
}
export function getProfileArtistsLibrary({ username, page, range, search }) {
  return api.get(`/users/${username}/library/artists`, {
    params: { page, range, search },
  });
}
export function getProfileTracksLibrary({ username, page, range, search }) {
  return api.get(`/users/${username}/library/tracks`, {
    params: { page, range, search },
  });
}
export function getProfileCompatibility({ username }) {
  return api.get(`/users/${username}/compatibility`);
}
export function getFollowers(username) {
  return api.get(`/users/${username}/followers`);
}
export function getFollowing(username) {
  return api.get(`/users/${username}/follows`);
}

export function followProfile(username) {
  return api.post(`/follow?username=${username}`);
}
export function unfollowProfile(username) {
  return api.delete(`/follow?username=${username}`);
}

export function getAccount() {
  return api.get("/settings");
}
export function updateAccount(settings) {
  return api.post("/settings", settings);
}

export function getTrackLyrics({ title, artist }) {
  return api.get("/lyrics", { params: { title, artist } });
}

export function getTrack(id) {
  return api.get(`/infopage/track/${id}`);
}
export function getMoreTracks(id) {
  return api.get(`/infopage/track/${id}/more-tracks`);
}
export function getArtist(id) {
  return api.get(`/infopage/artist/${id}`);
}
export function getArtistAlbums(id) {
  return api.get(`/infopage/artist/${id}/albums`);
}
export function getRelatedArtists(id) {
  return api.get(`/infopage/artist/${id}/related-artists`);
}
export function getAlbum(id) {
  return api.get(`/infopage/album/${id}`);
}
export function getAlbumArtists(id) {
  return api.get(`/infopage/album/${id}/artists`);
}
export function getAlbumContent(id) {
  return api.get(`/infopage/album/${id}/content`);
}

export function doSearch(query) {
  return api.get("/search", { params: { search: query } });
}
