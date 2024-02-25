import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";
import { clientFormData } from "@/services/client";
import { QueryType } from "@/interface/common";
import {
  ResUserManagementType,
  ResUserManagementTypeById,
} from "@/interface/user-management.interface";
import { FormProfileValues } from "@/interface/my-profile.interface";

const fetchUserManagement = async ({ query = {} }) => {
  return client("/users", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useUserManagement = ({
  query,
  options,
}: {
  query?: QueryType;
  options?: any;
}): UseQueryResult<ResUserManagementType, Error> => {
  return useQuery({
    queryKey: ["user-management", query],
    queryFn: () => fetchUserManagement({ query }),
    ...options,
  });
};

const fetchUserManagementById = async ({ id }: { id?: number }) => {
  return client(`/users/${id}`).then((data) => data);
};

const useUserManagementById = ({
  id,
  options,
}: {
  id?: number;
  options?: any;
}): UseQueryResult<ResUserManagementTypeById, Error> => {
  return useQuery({
    queryKey: ["user-management", id],
    queryFn: () => fetchUserManagementById({ id }),
    ...options,
  });
};

function useCreateUserManagement({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientFormData("/users", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as UseMutationResult<FormProfileValues, Error>;
}

function useUpdateUserManagement({ options, id }: { options?: any; id?: number }) {
  return useMutation({
    mutationFn: (updates) =>
      clientFormData(`/users/${id}`, {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as UseMutationResult<FormProfileValues, Error>;
}

function useDeleteUserManagement({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (updates: any) =>
      client(`/users/${updates.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

function useDeleteBulkUserManagement({ options }: { options?: any }) {
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
