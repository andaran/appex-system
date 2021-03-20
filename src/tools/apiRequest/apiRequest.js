
/*   ---==== Automatic user api request ====---   */

const request = (url, params) => {
  const body = JSON.stringify({ ...params });
  return fetch(url, {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body
  });
}

export { request };