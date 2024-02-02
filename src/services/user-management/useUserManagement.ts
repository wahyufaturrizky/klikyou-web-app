import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchUserManagement = async ({ query = {} }) => {
  return client("/getUserManagement", {
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

function useCreateUserManagement({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/createUserManagement", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateUserManagement({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/updateUserManagement", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

function useDeleteUserManagement({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/updateUserManagement", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export {
  useCreateUserManagement,
  useUserManagement,
  useUpdateUserManagement,
  useDeleteUserManagement,
};
