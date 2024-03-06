import { message } from "antd";
import axios, { AxiosResponse } from "axios";

export async function client(
  endpoint: string | string[],
  { data, method = "GET", params, headers: customHeaders, ...customConfig }: any = {}
) {
  const token = localStorage.getItem("access_token");
  const viewOnly = JSON.parse(localStorage.getItem("viewOnly") as string);
  const userProfile = JSON.parse(localStorage.getItem("userProfile") as string);

  const apiURL = process.env.NEXT_PUBLIC_BASE_URL;

  const config = {
    url: `${apiURL}${endpoint}`,
    method: method || (data ? "POST" : "GET"),
    headers: {
      "Content-Type": data ? "application/json" : undefined,
      ...(token && { Authorization: `Bearer ${token}` }),
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

  // If view mode true only can view only
  if (
    !viewOnly &&
    ["POST", "PUT", "DELETE"].includes(config.method) &&
    !["/auth/logout", "/auth/login"].includes(endpoint as string) &&
    !["Super Admin"].includes(userProfile?.role?.levelName)
  ) {
    message.warning("💰💰💰You in view mode, subscribe our system to get full access 💰💰💰");
    return;
  }

  return axios(config)
    .then(async (response: AxiosResponse<any, any>) => {
      console.log(
        `@success res, url = ${response.config.url} , METHOD = ${response.config.method}`,
        response
      );

      return response;
    })
    .catch((e: any) => {
      console.log(`@Error res, url = ${e.config.url} , METHOD = ${e.config.method}`, e);
      message.error(e?.response?.data?.message);
    });
}

export async function clientFormData(
  endpoint: string | string[],
  { data, method = "GET", params, headers: customHeaders, ...customConfig }: any = {}
) {
  const token = localStorage.getItem("access_token");
  const viewOnly = JSON.parse(localStorage.getItem("viewOnly") as string);
  const userProfile = JSON.parse(localStorage.getItem("userProfile") as string);

  const apiURL = process.env.NEXT_PUBLIC_BASE_URL;

  const config = {
    url: `${apiURL}${endpoint}`,
    method: method || (data ? "POST" : "GET"),
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
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

  // If view mode true only can view only
  if (
    !viewOnly &&
    ["POST", "PUT", "DELETE"].includes(config.method) &&
    !["/auth/logout", "/auth/login"].includes(endpoint as string) &&
    !["Super Admin"].includes(userProfile?.role?.levelName)
  ) {
    message.warning("💰💰💰You in view mode, subscribe our system to get full access 💰💰💰");
    return;
  }

  return axios(config)
    .then(async (response: AxiosResponse<any, any>) => {
      console.log(
        `@success res, url = ${response.config.url} , METHOD = ${response.config.method}`,
        response
      );

      return response;
    })
    .catch((e: any) => {
      console.log(`@Error res, url = ${e.config.url} , METHOD = ${e.config.method}`, e);

      message.error(e?.response?.data?.message);
    });
}
