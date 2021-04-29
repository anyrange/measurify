const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

afterAll(async () => {
  mongoose.connection.close();
});

test("Get friends (he has no friends ha ha)", async () => {
  console.log(typeof process.env.TEST_ID);
  console.log(process.env.TEST_ID);
  await request(app)
    .get("/friends")
    .set("Authorization", process.env.TEST_ID)
    .expect(204);
}, 15000);
