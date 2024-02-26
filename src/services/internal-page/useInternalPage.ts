import { clientFormData } from "@/services/client";
import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchInternalPage = async ({ query = {} }) => {
  return client("/internal-settings", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useInternalPage = ({ query = {}, options }: any = {}): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["internal-settings", query],
    queryFn: () => fetchInternalPage({ query }),
    ...options,
  });
};

function useUpdateInternalPage({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      clientFormData("/internal-settings", {
        method: "POST",
        data: updates,
      }),
    ...options,
  }) as any;
}

export { useInternalPage, useUpdateInternalPage };
