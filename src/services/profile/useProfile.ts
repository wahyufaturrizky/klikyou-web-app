import { FormProfileValues, DataResponseMyProfileType } from "@/interface/my-profile.interface";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client, clientFormData } from "../client";
import { QueryType } from "@/interface/common";

const fetchProfile = async ({ query }: { query?: QueryType }) => {
  return client("/my-profile", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useProfile = ({
  query,
  options,
}: {
  query?: QueryType;
  options?: any;
}): UseQueryResult<DataResponseMyProfileType, Error> => {
  return useQuery({
    queryKey: ["profile", query],
    queryFn: () => fetchProfile({ query }),
    ...options,
  });
};

function useUpdateProfile({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientFormData("/my-profile", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as UseMutationResult<FormProfileValues, Error>;
}

export { useProfile, useUpdateProfile };
