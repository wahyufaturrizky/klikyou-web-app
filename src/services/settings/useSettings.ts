import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchSettings = async ({ query = {} }) => {
  return client("/getSettings", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useSettings = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["settings", query],
    queryFn: () => fetchSettings({ query }),
    ...options,
  }) as any;
};

function useCreateSettings({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/createSettings", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateSettings({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/updateSettings", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

function useDeleteSettings({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/updateSettings", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export { useCreateSettings, useSettings, useUpdateSettings, useDeleteSettings };
