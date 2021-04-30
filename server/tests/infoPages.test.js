const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("../db");

afterAll(() => {
  mongoose.connection.close();
});

// User without listening history

//artist section
Artist: {
  test("No param", async () => {
    await request(app)
      .get("/artist")
      .set("Authorization", process.env.TEST_ID)
      .expect(404);
  }, 10000);

  test("Some random symbols as param", async () => {
    await request(app)
      .get("/artist/NOTEXISTINGARTIST")
      .set("Authorization", process.env.TEST_ID)
      .expect(404);
  }, 10000);

  test("Real artist", async () => {
    await request(app)
      .get("/artist/0GDGKpJFhVpcjIGF8N6Ewt")
      .set("Authorization", process.env.TEST_ID)
      .expect(204);
  }, 10000);
}

//album section

Album: {
  test("No param", async () => {
    await request(app)
      .get("/album")
      .set("Authorization", process.env.TEST_ID)
      .expect(404);
  }, 10000);

  test("Some random symbols as param", async () => {
    await request(app)
      .get("/album/NOTEXISTINGALBUM")
      .set("Authorization", process.env.TEST_ID)
      .expect(404);
  }, 10000);

  test("Real album", async () => {
    await request(app)
      .get("/album/1VlMcoG1aI4E4kBIVoH5cp")
      .set("Authorization", process.env.TEST_ID)
      .expect(204);
  }, 10000);
}

//track section
Track: {
  test("No param", async () => {
    await request(app)
      .get("/track")
      .set("Authorization", process.env.TEST_ID)
      .expect(404);
  }, 10000);

  test("Some random symbols as param", async () => {
    await request(app)
      .get("/track/NOTEXISTINGALBUM")
      .set("Authorization", process.env.TEST_ID)
      .expect(404);
  }, 10000);

  test("Real track", async () => {
    await request(app)
      .get("/track/4hjimPPw7JbgDoxuo8OhCG")
      .set("Authorization", process.env.TEST_ID)
      .expect(204);
  }, 10000);
}
