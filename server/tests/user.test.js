const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("../db");

afterAll(() => {
  mongoose.connection.close();
});

InvalidData: {
  test("No data", async () => {
    await request(app)
      .get("/user")
      .set("Authorization", process.env.TEST_ID)
      .expect(404);
  }, 10000);

  test("Invalid user", async () => {
    await request(app)
      .get("/user/18szy10xcrh79l1qs06udtsnr")
      .set("Authorization", process.env.TEST_ID)
      .expect(400);
  }, 10000);
}

// test("User with without listening history", async () => {
//   await request(app)
//     .get("/user/")
//     .set("Authorization", process.env.TEST_ID)
//     .expect(204);
// }, 10000);
