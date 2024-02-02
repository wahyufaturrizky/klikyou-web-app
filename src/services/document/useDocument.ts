import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchDocument = async ({ query = {} }) => {
  return client("/getDocument", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useDocument = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["document", query],
    queryFn: () => fetchDocument({ query }),
    ...options,
  }) as any;
};

function useCreateDocument({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/createDocument", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateDocument({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/updateDocument", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteDocument({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/updateDocument", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export { useCreateDocument, useDocument, useUpdateDocument, useDeleteDocument };