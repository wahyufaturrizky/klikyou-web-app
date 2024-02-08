import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchDocument = async ({ query = {} }) => {
  return client("/documents", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useDocument = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["documents", query],
    queryFn: () => fetchDocument({ query }),
    ...options,
  }) as any;
};

const fetchDocumentById = async ({ id }: { id: string }) => {
  return client(`/documents/${id}`).then((data) => data);
};

const useDocumentById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => fetchDocumentById({ id }),
    ...options,
  }) as any;
};

function useCreateDocument({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/documents", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateDocument({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/documents", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteDocument({ options }: any) {
  return useMutation({
    mutationFn: (updates: any) =>
      client(`/documents/${updates.id}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

function useDeleteBulkDocument({ options }: any) {
  return useMutation({
    mutationFn: (query: any) =>
      client(`/documents?ids=${query.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

export {
  useCreateDocument,
  useDeleteBulkDocument,
  useDeleteDocument,
  useDocument,
  useDocumentById,
  useUpdateDocument,
};
