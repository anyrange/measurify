import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { redirect, authorise } from "@/api";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

export default createStore({
  state: {
    user: null,
    id: null,
    access_token: null,
    notifications: [],
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_ID(state, payload) {
      state.id = payload;
    },
    SET_ACCES_TOKEN(state, payload) {
      state.access_token = payload;
    },
    ADD_NOTIFICATION(state, payload) {
      state.notifications.push(payload);
    },
    REMOVE_NOTIFICATION(state, payload) {
      const index = state.notifications.indexOf(payload);
      state.notifications.splice(index, 1);
    },
    RESET_NOTIFICATIONS(state) {
      state.notifications = [];
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getUserID(state) {
      return state.id;
    },
    getAccessToken(state) {
      return state.access_token;
    },
    getNotifications(state) {
      return state.notifications;
    },
  },
  actions: {
    login: () => {
      redirect();
    },
    logout: () => {
      window.localStorage.clear();
      window.sessionStorage.clear();
      location.reload();
    },
    authorise: async ({ commit }, { access_token, id }) => {
      const response = await authorise(access_token);
      commit("SET_ID", id);
      commit("SET_USER", response);
      commit("SET_ACCES_TOKEN", access_token);
    },
    addNotification: ({ commit, dispatch }, { notification }) => {
      commit("ADD_NOTIFICATION", notification);
      if (notification.progress && notification.delay > 0) {
        setTimeout(() => {
          dispatch("removeNotification", notification);
        }, notification.delay);
      }
    },
    removeNotification: ({ commit }, { notification }) => {
      commit("REMOVE_NOTIFICATION", notification);
    },
    resetNotifications: ({ commit }) => {
      commit("RESET_NOTIFICATIONS");
    },
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});
