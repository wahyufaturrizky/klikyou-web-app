import axios from "axios";

export async function client(
  endpoint: string | string[],
  { data, method = "GET", params, headers: customHeaders, ...customConfig }: any = {}
) {
  const token = localStorage.getItem("access_token");
  const apiURL = process.env.NEXT_PUBLIC_BASE_URL;

  const config = {
    url: `${apiURL}${endpoint}`,
    method: method || (data ? "POST" : "GET"),
    headers: {
      "Content-Type": data ? "application/json" : undefined,
      ...(token && { "x-access-token": token }),
      ...customHeaders,
    },
    ...customConfig,
  };

  if (params) {
    config.params = params;
    config.method = "GET";
  }

  if (data) {
    config.data = data;
  }

  return axios(config)
    .then(async (response: any) => {
      return response;
    })
    .catch((e: any) => {
      if (e?.response?.status === 500) {
        localStorage.removeItem("access_token");
        window.location.replace("/");
      }
      window.alert(e.response.data.message?.[0]);
    });
}
