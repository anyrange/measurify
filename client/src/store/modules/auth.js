import { deauthorize, getCurrentUser } from "@/api";
import $router from "@/router";

const getDefaultState = () => {
  return {
    user: {
      avatar: "",
      displayName: "",
      username: "",
      country: "",
      autoUpdate: false,
    },
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    SET_AUTH(state, { avatar, display_name, username, country, autoUpdate }) {
      state.user = {
        ...state.user,
        avatar,
        displayName: display_name,
        username,
        country,
        autoUpdate,
      };
    },
    PURGE_AUTH: (state) => {
      Object.assign(state, getDefaultState());
    },
  },
  getters: {
    isAuthenticated(state) {
      return !Object.keys(state.user).every((k) => !state.user[k]);
    },
    getUser(state) {
      return state.user;
    },
  },
  actions: {
    updateUser: async ({ commit }) => {
      try {
        commit("SET_AUTH", await getCurrentUser());
      } catch (error) {
        return Promise.reject(error);
      }
    },
    logout: async ({ commit }) => {
      await deauthorize();
      commit("PURGE_AUTH");
      $router.push({ name: "login" });
    },
  },
};
