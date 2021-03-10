
/*   ---==== Automatic user api request ====---   */

const request = (url, params) => {
  const body = JSON.stringify({ ...params });
  return fetch(`/api/${ url }`, {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body
  }).then(res => res.json());
}

export { request };