import overview from "../includes/format-overview.js";

test("overview user with empty array", () => {
  expect(overview([])).toEqual([]);
});

test("overview user with empty data", () => {
  expect(overview()).toEqual([]);
});
