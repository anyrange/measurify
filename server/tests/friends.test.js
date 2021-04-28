const request = require("supertest");
const app = require("../app");

test("Get friends (he has no friends ha ha)", async () => {
  await request(app)
    .get("/friends")
    .set("Authorization", process.env.TEST_ID)
    .expect(204);
}, 15000);
