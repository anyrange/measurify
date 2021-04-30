const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true },
  () => console.info(`Database successfully connected`)
);
