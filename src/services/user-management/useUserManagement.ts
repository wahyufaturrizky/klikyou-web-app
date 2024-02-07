import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { clientFormData } from "@/services/client";

const fetchUserManagement = async ({ query = {} }) => {
  return client("/users", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useUserManagement = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["user-management", query],
    queryFn: () => fetchUserManagement({ query }),
    ...options,
  }) as any;
};

const fetchUserManagementById = async ({ id }: { id: string }) => {
  return client(`/users/${id}`).then((data) => data);
};

const useUserManagementById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["user-management", id],
    queryFn: () => fetchUserManagementById({ id }),
    ...options,
  }) as any;
};

function useCreateUserManagement({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientFormData("/users", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateUserManagement({ options, id }: any) {
  return useMutation({
    mutationFn: (updates) =>
      clientFormData(`/users/${id}`, {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

function useDeleteUserManagement({ options }: any) {
  return useMutation({
    mutationFn: (updates: any) =>
      client(`/users/${updates.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

function useDeleteBulkUserManagement({ options }: any) {
  return useMutation({
    mutationFn: (query: any) =>
      client(`/users?ids=${query.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

export {
  useCreateUserManagement,
  useUserManagement,
  useUpdateUserManagement,
  useDeleteUserManagement,
  useUserManagementById,
  useDeleteBulkUserManagement,
};
