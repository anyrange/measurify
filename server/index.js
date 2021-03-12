const express = require("express");
const router = require("./router");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT);
app.use(router);

console.log(`App listening on port: ${PORT}`);

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, () =>
  console.log(`Database Successfully Connected`)
);
