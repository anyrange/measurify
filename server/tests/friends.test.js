const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

afterAll(async () => {
  mongoose.connection.close();
});

test("Get friends (he has no friends ha ha)", async () => {
  await request(app)
    .get("/friends")
    .set("Authorization", process.env.TEST_ID)
    .expect(204);
}, 10000);
