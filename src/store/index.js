import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const getDefaultState = () => {
  return {
    user: {},
    playlists: null,
    backendurl: process.env.VUE_APP_SERVER_URI,
  };
};

export default createStore({
  state: getDefaultState(),
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
    getBackendURL(state) {
      return state.backendurl;
    },
  },
  actions: {
    logout: ({ commit }) => {
      commit("mutateUser", null);
    },
  },
  plugins: [createPersistedState()],
});
