import axios from "axios";
import store from "@/store/index.js";

const ENV_URI = store.getters.getBackendURL;

const url = ENV_URI || "http://localhost:8888/";

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
