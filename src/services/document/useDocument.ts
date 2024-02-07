import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchDocument = async ({ query = {} }) => {
  return client("/document", {
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

const fetchDocumentById = async ({ id }: { id: string }) => {
  return client(`/document/${id}`).then((data) => data);
};

const useDocumentById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => fetchDocumentById({ id }),
    ...options,
  }) as any;
};

function useCreateDocument({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/document", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateDocument({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/document", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteDocument({ options }: any) {
  return useMutation({
    mutationFn: (updates: any) =>
      client(`/document?ids=${updates.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

export { useCreateDocument, useDeleteDocument, useDocument, useDocumentById, useUpdateDocument };
