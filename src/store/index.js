import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import authModule from "@/store/modules/auth";
import notificationsModule from "@/store/modules/notifications";

export default createStore({
  modules: { authModule, notificationsModule },
  plugins: [createPersistedState()],
});
