import axios from "axios";

const url = process.env.VUE_APP_SERVER_URI || "http://localhost:8888/";

export default {
  getListeningHistory(id) {
    return axios
      .get(url + "/listening-history", {
        headers: {
          Authorization: id,
        },
      })
      .then((response) => response.data);
  },
};
