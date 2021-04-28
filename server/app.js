require("dotenv").config();
const express = require("express");
const router = require("./router");
require("./db");
const cors = require("cors");

const app = express();
app.use(express.json());

let corsOptions = {};
if (process.env.NODE_ENV == "production") {
  const FRONTEND_URI = process.env.FRONTEND_URI || "http://localhost:3000";
  const whitelist = [FRONTEND_URI];
  corsOptions = {
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        const message =
          "The CORS policy for this origin doesnt allow access from the particular origin. Origin:" +
          origin;
        return callback(message, false);
      }
      return callback(null, true);
    },
  };
}
app.use(cors(corsOptions));

app.use(router);
module.exports = app;
