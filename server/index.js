const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, () =>
  console.log(`Successfully Connected`)
);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
