import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchDocumentTags = async ({ query = {} }) => {
  return client("/master-document-tags", {
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
      client("/master-document-tags", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateDocumentTags({ options, id }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client(`/master-document-tags/${id}`, {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

function useDeleteDocumentTags({ options }: any) {
  return useMutation({
    mutationFn: (query: any) =>
      client(`/master-document-tags?ids=${query.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

export { useCreateDocumentTags, useDocumentTags, useUpdateDocumentTags, useDeleteDocumentTags };
