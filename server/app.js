const express = require("express");
const router = require("./router");
const cors = require("cors");
const app = express();

app.use(express.json());

const FRONTEND_URI = process.env.FRONTEND_URI || "http://localhost:3000";
const URI = new URL(FRONTEND_URI);
const WHITE_LIST = [FRONTEND_URI, `${URI.protocol}//master--${URI.host}`];

app.use(
  cors({
    origin: WHITE_LIST,
    credentials: true,
  })
);

process.on("unhandledRejection", (error) => {
  console.log("Error:", error.message);
});

app.use(router);
module.exports = app;
