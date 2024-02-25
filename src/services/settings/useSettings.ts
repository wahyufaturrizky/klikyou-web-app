import { QueryType } from "@/interface/common";
import { FormSettingsValues, ResSettingsType } from "@/interface/settings.interface";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client, clientFormData } from "../client";

const fetchSettings = async ({ query = {} }) => {
  return client("/settings", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useSettings = ({
  query,
  options,
  queryKey,
}: {
  query?: QueryType;
  options?: any;
  queryKey?: string;
}): UseQueryResult<ResSettingsType, Error> => {
  return useQuery({
    queryKey: [queryKey, query],
    queryFn: () => fetchSettings({ query }),
    ...options,
  });
};

function useUpdateSettings({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientFormData("/settings", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as UseMutationResult<FormSettingsValues, Error>;
}

export { useSettings, useUpdateSettings };
