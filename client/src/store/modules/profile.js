import {
  getProfile,
  getProfileReports,
  getProfileListeningHistory,
} from "@/api";

const getDefaultState = () => {
  return {
    profile: {},
    reports: {},
    listeningHistory: {},
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    SET_PROFILE(state, response) {
      Object.assign(state.profile, response);
    },
    SET_REPORTS(state, response) {
      Object.assign(state.reports, response);
    },
    SET_HISTORY(state, response) {
      Object.assign(state.listeningHistory, response);
    },
  },
  actions: {
    getProfile: async ({ commit }, username) => {
      try {
        commit("SET_PROFILE", await getProfile({ username }));
      } catch (error) {
        return Promise.reject(error);
      }
    },
    getReports: async ({ commit, state }) => {
      try {
        commit(
          "SET_REPORTS",
          await getProfileReports({ username: state.profile.user.username })
        );
      } catch (error) {
        return Promise.reject(error);
      }
    },
    getHistory: async ({ commit, state }, { page, range, search }) => {
      try {
        commit(
          "SET_HISTORY",
          await getProfileListeningHistory({
            username: state.profile.user.username,
            page,
            range,
            search,
          })
        );
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
};
