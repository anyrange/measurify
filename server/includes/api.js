import fetch from "node-fetch";
import CustomError from "./CustomError.js";

export default async function({ route, token, body = {}, method = "GET" }) {
  let options = { method };
  if (method !== "GET") options = Object.assign(options, { body });

  if (token)
    options = Object.assign(options, {
      headers: { Authorization: "Bearer " + token },
    });

  // console.log(`https://api.spotify.com/v1/${route}`, options);

  const callApi = async () => {
    const res = await fetch(`https://api.spotify.com/v1/${route}`, options);
    if (res.status === 403) {
      console.log("fail");
      return await callApi();
    }
    return res;
  };

  const res = await callApi();

  if (!res.ok) {
    console.log("Error:", res.statusText, res.status);
    throw new CustomError("Something went wrong", 500);
  }

  const json = await res.json();

  if (json.error)
    throw new CustomError(json.error.message, json.error.status || 500);

  return json;
}
