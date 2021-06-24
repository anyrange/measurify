import { deauthorize, getCurrentUser } from "@/api";
import $router from "@/router";

export default {
  namespaced: false,
  state: {
    user: {
      access_token: "",
      avatar: "",
      username: "",
      autoUpdate: false,
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    UPDATE_USER(state, user) {
      state.user = {
        ...state.user,
        access_token: user.access_token,
        avatar: user.avatar,
        username: user.username,
        autoUpdate: user.autoUpdate,
      };
    },
    CHANGE_AUTOUPDATE(state, payload) {
      state.user.autoUpdate = payload;
    },
  },
  getters: {
    isAuthenticated(state) {
      if (Object.keys(state.user).every((k) => !state.user[k])) return false;
      return true;
    },
    getUser(state) {
      return state.user;
    },
    getAutoupdates(state) {
      return state.user.autoUpdate;
    },
  },
  actions: {
    logout: async ({ commit }) => {
      await deauthorize();
      commit("SET_USER", {
        username: "",
        avatar: "",
        access_token: "",
      });
      $router.push({ name: "login" });
    },
    updateUser: async ({ commit }) => {
      const response = await getCurrentUser();
      commit("UPDATE_USER", {
        username: response.userName,
        avatar: response.avatar,
        access_token: response.token,
        autoUpdate: response.autoUpdate,
      });
    },
    changeAutoupdate: ({ commit }, value) => {
      commit("CHANGE_AUTOUPDATE", value);
    },
  },
};
