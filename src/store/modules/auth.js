import { authorise, deauthorize, getToken } from "@/api";

export default {
  namespaced: false,
  state: {
    user: {
      access_token: "",
      avatar: "",
      username: "",
      email: "",
    },
  },
  mutations: {
    SET_ACCES_TOKEN(state, payload) {
      state.user.access_token = payload;
    },
    SET_AVATAR(state, payload) {
      state.user.avatar = payload;
    },
    SET_EMAIL(state, payload) {
      state.user.email = payload;
    },
    SET_USERNAME(state, payload) {
      state.user.username = payload;
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
    logout: async () => {
      await deauthorize();
      window.localStorage.clear();
      window.sessionStorage.clear();
      location.reload();
    },
    authorise: async ({ commit }, { access_token }) => {
      const response = await authorise(access_token);
      commit("SET_USERNAME", response.display_name);
      commit("SET_EMAIL", response.email);
      commit("SET_AVATAR", response.images[0].url);
      commit("SET_ACCES_TOKEN", access_token);
    },
    updateUser: async ({ commit }) => {
      const response = await getToken();
      commit("SET_USERNAME", response.userName);
      commit("SET_AVATAR", response.avatar);
      commit("SET_ACCES_TOKEN", response.token);
    },
  },
};
