import { useMutation, useQuery } from "@tanstack/react-query";
import { client, clientFormData } from "../client";

const fetchProfile = async ({ query = {} }) => {
  return client("/my-profile", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useProfile = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["profile", query],
    queryFn: () => fetchProfile({ query }),
    ...options,
  }) as any;
};

function useCreateProfile({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientFormData("/my-profile", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateProfile({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/my-profile", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

export { useCreateProfile, useProfile, useUpdateProfile };
