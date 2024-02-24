import { QueryType } from "@/interface/common";
import { DataResponseDocumentType } from "@/interface/documents.interface";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { client, clientFormData } from "../client";

const fetchDocument = async ({
  query = {},
  action,
}: {
  query: any;
  action?: "receival" | "approval" | "";
}) => {
  return client(action ? `/documents${action}` : "/documents", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useDocument = ({
  query,
  options,
  action,
}: {
  query?: QueryType;
  options?: any;
  action?: "receival" | "approval" | "";
} = {}): UseQueryResult<DataResponseDocumentType, Error> => {
  return useQuery({
    queryKey: ["documents", query],
    queryFn: () => fetchDocument({ query, action }),
    ...options,
  });
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
      clientFormData("/documents", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateDocument({ options, id }: any) {
  return useMutation({
    mutationFn: (updates) =>
      clientFormData(`/documents/${id}`, {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
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

function useDocumentApproveRejectProcess({
  options,
  id,
  action,
  ids,
}: {
  options: any;
  id?: number | string;
  action: string;
  ids?: string;
}) {
  return useMutation({
    mutationFn: (updates) =>
      clientFormData(id ? `/documents/${action}/${id}` : `/documents/${action}?ids=${ids}`, {
        method: "POST",
        data: updates,
      }),
    ...options,
  }) as any;
}

export {
  useCreateDocument,
  useDeleteBulkDocument,
  useDeleteDocument,
  useDocument,
  useDocumentApproveRejectProcess,
  useDocumentById,
  useUpdateDocument,
};
