import fetch from "node-fetch";

export default async function ({ route, token, body = {}, method = "GET" }) {
  let options = { method };
  if (method !== "GET") options = Object.assign(options, { body });

  if (token)
    options = Object.assign(options, {
      headers: { Authorization: "Bearer " + token },
    });

  // const callApi = async () => {
  const res = await fetch(`https://api.spotify.com/v1/${route}`, options);
  //   if (res.status === 403) {
  //     console.log("api fail");
  //     return await callApi();
  //   }
  //   return res;
  // };
  // const res = await callApi();

  if (res.status === 204) throw Object.assign(new Error(""), { code: 204 });

  // if (!res.ok) {
  //   console.log("API Error:", res.statusText, res.status);
  //   console.log(`https://api.spotify.com/v1/${route}`);
  //   console.log(options);
  //   throw Object.assign(new Error("Something went wrong"), { code: 500 });
  // }

  const json = await res.json().catch(() => {
    console.log("API Error:", res.statusText, res.status);
    console.log(`https://api.spotify.com/v1/${route}`);
    console.log(options);
    throw Object.assign(new Error("Something went wrong"), { code: 500 });
  });

  if (json.error) {
    console.log("API Error:", res.statusText, res.status);
    const err = json.error;
    console.log(err);
    throw Object.assign(new Error(err.message), {
      code: err.status || 500,
    });
  }

  return json;
}
