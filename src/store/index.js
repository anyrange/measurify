import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import api from "@/api";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

export default createStore({
  state: {
    user: null,
    id: null,
    access_token: null,
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
  },
  actions: {
    login: () => {
      api.login();
    },
    logout: () => {
      window.localStorage.clear();
      window.sessionStorage.clear();
      // let script = document.createElement("script");
      // script.src = "https://www.spotify.com/logout/";
      // script.type = "text/javascript";
      // document.getElementById("app").appendChild(script);
      location.reload();
    },
    authorise: async ({ commit }, { access_token, id }) => {
      const response = await api.authorise(access_token);
      commit("SET_ID", id);
      commit("SET_USER", response);
      commit("SET_ACCES_TOKEN", access_token);
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
