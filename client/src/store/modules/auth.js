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
      state.user = {
        ...state.user,
        access_token: user.access_token,
        avatar: user.avatar,
        username: user.username,
        autoUpdate: user.autoUpdate,
        country: user.country,
      };
    },
    REMOVE_USER: (state) => {
      Object.assign(state, getDefaultState());
    },
    CHANGE_AUTOUPDATE(state, payload) {
      state.user.autoUpdate = payload;
    },
  },
  getters: {
    isAuthenticated(state) {
      return Object.keys(state.user).every((k) => state.user[k]);
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
      try {
        const response = await getCurrentUser();
        commit("SET_USER", {
          username: response.userName,
          avatar: response.avatar,
          access_token: response.token,
          autoUpdate: response.autoUpdate,
          country: response.country,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    changeAutoupdate: ({ commit }, value) => {
      commit("CHANGE_AUTOUPDATE", value);
    },
  },
};
