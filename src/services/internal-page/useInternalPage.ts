import { clientFormData } from "@/services/client";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";
import {
  DataResponseInternalSettingsType,
  FormValueInternalPageType,
} from "@/interface/internal-page.interface";

const fetchInternalPage = async ({ query = {} }) => {
  return client("/internal-settings", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useInternalPage = ({ query = {}, options }: any = {}): UseQueryResult<
  DataResponseInternalSettingsType,
  Error
> => {
  return useQuery({
    queryKey: ["internal-settings", query],
    queryFn: () => fetchInternalPage({ query }),
    ...options,
  });
};

function useUpdateInternalPage({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (updates) =>
      client("/internal-settings", {
        method: "POST",
        data: updates,
      }),
    ...options,
  }) as UseMutationResult<FormValueInternalPageType, Error>;
}

export { useInternalPage, useUpdateInternalPage };
