import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import Home from "../views/Home";

export default createStore({
  state: {
    user: null,
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
  },
  actions: {},
  modules: {
    Home,
  },
  plugins: [createPersistedState()],
});
