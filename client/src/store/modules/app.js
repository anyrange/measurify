export default {
  state: {
    historyLength: 0,
  },
  mutations: {
    SET_HISTORY: (state, value) => {
      state.historyLength = value;
    },
  },
};
