import { deauthorize, getCurrentUser } from "@/api";
import $router from "@/router";

const getDefaultState = () => {
  return {
    user: {
      access_token: "",
      avatar: "",
      username: "",
      autoUpdate: false,
    },
  };
};

export default {
  namespaced: false,
  state: getDefaultState(),
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    REMOVE_USER: (state) => {
      Object.assign(state, getDefaultState());
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
  },
  actions: {
    logout: async ({ commit, state }) => {
      await deauthorize();
      commit("REMOVE_USER", state.user);
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
