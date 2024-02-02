import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchDocumentTags = async ({ query = {} }) => {
  return client("/getDocumentTags", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useDocumentTags = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["document-tags", query],
    queryFn: () => fetchDocumentTags({ query }),
    ...options,
  }) as any;
};

function useCreateDocumentTags({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/createDocumentTags", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateDocumentTags({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/updateDocumentTags", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteDocumentTags({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/updateDocumentTags", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export { useCreateDocumentTags, useDocumentTags, useUpdateDocumentTags, useDeleteDocumentTags };
