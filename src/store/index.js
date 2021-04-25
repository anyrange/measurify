import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import api from "@/api";

export default createStore({
  state: {
    user: null,
    access_token: null,
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
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
      return state.user._id;
    },
    getAccessToken(state) {
      return state.access_token;
    },
  },
  actions: {
    login: () => {
      api.login();
    },
    logout: ({ commit }) => {
      commit("SET_USER", null);
      commit("SET_ACCES_TOKEN", null);
    },
    authorise: async ({ commit }, { access_token, id }) => {
      const response = await api.authorise(access_token);
      response._id = id;
      commit("SET_USER", response);
      commit("SET_ACCES_TOKEN", access_token);
    },
  },
  plugins: [createPersistedState()],
});
