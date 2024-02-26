import { clientFormData } from "@/services/client";
import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchInternalPage = async ({ query = {} }) => {
  return client("/internal-page", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useInternalPage = ({ query = {}, options }: any = {}): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ["internal-page", query],
    queryFn: () => fetchInternalPage({ query }),
    ...options,
  });
};

function useUpdateInternalPage({ options, id }: any) {
  return useMutation({
    mutationFn: (updates) =>
      clientFormData(`/documents/${id}`, {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

export { useInternalPage, useUpdateInternalPage };
