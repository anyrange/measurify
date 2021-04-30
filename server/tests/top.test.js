const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("../db");

afterAll(() => {
  mongoose.connection.close();
});

test("User without listening history", async () => {
  await request(app)
    .get("/top")
    .set("Authorization", process.env.TEST_ID)
    .expect(204);
}, 10000);
