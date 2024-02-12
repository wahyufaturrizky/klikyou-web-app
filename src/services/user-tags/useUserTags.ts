import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchUserTags = async ({ query = {} }) => {
  return client("/master-user-tags", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useUserTags = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["user-tags", query],
    queryFn: () => fetchUserTags({ query }),
    ...options,
  }) as any;
};

function useCreateUserTags({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/master-user-tags", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateUserTags({ options, id }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client(`/master-user-tags/${id}`, {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

function useDeleteUserTags({ options }: any) {
  return useMutation({
    mutationFn: (query: any) =>
      client(`/master-user-tags?ids=${query.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

export { useCreateUserTags, useUserTags, useUpdateUserTags, useDeleteUserTags };
