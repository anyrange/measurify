import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    user: {},
    backendurl: process.env.VUE_APP_SERVER_URI,
  },
  mutations: {
    mutateUser(state, payload) {
      state.user = payload;
    },
  },
  getters: {
    getUser(state) {
      return state.user;
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
