import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import Home from "../views/Home";

export default createStore({
  state: {
    user: null,
    playlists: null
  },
  mutations: {
    mutateUser(state, payload) {
      state.user = payload;
    },
    mutatePlaylists(state, payload) {
      state.playlists = payload;
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getPlaylists(state) {
      return state.playlists;
    },
  },
  actions: {},
  modules: {
    Home,
  },
  plugins: [createPersistedState()],
});
