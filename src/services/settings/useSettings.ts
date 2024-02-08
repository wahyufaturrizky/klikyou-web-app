import { useMutation, useQuery } from "@tanstack/react-query";
import { client, clientFormData } from "../client";

const fetchSettings = async ({ query = {} }) => {
  return client("/settings", {
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
      clientFormData("/settings", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateSettings({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/settings", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

function useDeleteSettings({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/settings", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export { useCreateSettings, useDeleteSettings, useSettings, useUpdateSettings };
