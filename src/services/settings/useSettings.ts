import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client, clientFormData } from "../client";
import { QueryType } from "@/interface/common";
import { ResUpdateDocumentType, FormSettingsValues } from "@/interface/settings.interface";

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
}): UseQueryResult<ResUpdateDocumentType, Error> => {
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
