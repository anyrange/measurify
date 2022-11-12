export function useQuery() {
  const querystring = window.location.href.split("?")[1]
  const query = querystring
    ? querystring
        .split("&")
        .map((item) => item.split("="))
        .reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {})
    : {}

  return {
    querystring,
    query,
  }
}
