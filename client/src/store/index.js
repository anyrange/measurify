import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import app from "./modules/app.js";
import auth from "./modules/auth.js";
import profile from "./modules/profile.js";

export default createStore({
  modules: { app, auth, profile },
  plugins: [
    createPersistedState({
      paths: ["auth"],
    }),
  ],
});
