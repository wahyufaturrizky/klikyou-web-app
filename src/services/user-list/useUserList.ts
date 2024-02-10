import { useMutation, useQuery } from "@tanstack/react-query";
import { client, clientFormData } from "../client";

const fetchUserList = async ({ query = {} }) => {
  return client("/users-list", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useUserList = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["users-list", query],
    queryFn: () => fetchUserList({ query }),
    ...options,
  }) as any;
};

const fetchUserListById = async ({ id }: { id: string }) => {
  return client(`/users-list/${id}`).then((data) => data);
};

const useUserListById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["users-list", id],
    queryFn: () => fetchUserListById({ id }),
    ...options,
  }) as any;
};

function useCreateUserList({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientFormData("/users-list", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateUserList({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/users-list", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteUserList({ options }: any) {
  return useMutation({
    mutationFn: (updates: any) =>
      client(`/users-list/${updates.id}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

function useDeleteBulkUserList({ options }: any) {
  return useMutation({
    mutationFn: (query: any) =>
      client(`/users-list?ids=${query.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

export {
  useCreateUserList,
  useDeleteBulkUserList,
  useDeleteUserList,
  useUserList,
  useUserListById,
  useUpdateUserList,
};
