import { getProfile, getProfileReports } from "@/api";

const getDefaultState = () => {
  return {
    profile: {},
    reports: {},
  };
};

export default {
  state: getDefaultState(),
  mutations: {
    SET_PROFILE(state, response) {
      Object.assign(state.profile, response);
    },
    SET_REPORTS(state, response) {
      Object.assign(state.reports, response);
    },
  },
  actions: {
    getProfile: async ({ commit }, id) => {
      try {
        commit("SET_PROFILE", await getProfile({ id }));
      } catch (error) {
        return Promise.reject(error);
      }
    },
    getReports: async ({ commit, state }) => {
      try {
        commit(
          "SET_REPORTS",
          await getProfileReports(state.profile.user.username)
        );
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
};
