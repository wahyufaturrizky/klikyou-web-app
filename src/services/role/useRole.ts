import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchRole = async ({ query = {} }) => {
  return client("/roles", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useRole = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["roles", query],
    queryFn: () => fetchRole({ query }),
    ...options,
  }) as any;
};

const fetchRoleById = async ({ id }: { id: string }) => {
  return client(`/roles/${id}`).then((data) => data);
};

const useRoleById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => fetchRoleById({ id }),
    ...options,
  }) as any;
};

function useCreateRole({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/roles", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateRole({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/roles", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteRole({ options }: any) {
  return useMutation({
    mutationFn: (updates: any) =>
      client(`/roles?ids=${updates.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

export { useCreateRole, useDeleteRole, useRole, useRoleById, useUpdateRole };
