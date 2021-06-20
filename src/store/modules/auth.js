import { authorise, deauthorize, getToken } from "@/api";

export default {
  namespaced: false,
  state: {
    user: {
      access_token: "",
      avatar: "",
      username: "",
      email: "",
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
    logout: async () => {
      await deauthorize();
      window.localStorage.clear();
      window.sessionStorage.clear();
      location.reload();
    },
    authorise: async ({ commit }, access_token) => {
      const response = await authorise(access_token);
      commit("SET_USER", {
        username: response.display_name,
        email: response.email,
        avatar: response.images[0].url,
        access_token: access_token,
      });
    },
    updateUser: async ({ commit }) => {
      const response = await getToken();
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
