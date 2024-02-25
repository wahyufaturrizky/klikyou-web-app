import { QueryType } from "@/interface/common";
import {
  DataResponseDocumentType,
  DataResponseDocumentByIdType,
  FormDocumentValues,
} from "@/interface/documents.interface";
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query";
import { client, clientFormData } from "../client";

const fetchDocument = async ({
  query,
  action,
}: {
  query?: QueryType;
  action?: "receival" | "approval" | "";
}) => {
  return client(action ? `/documents/${action}` : "/documents", {
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

const fetchDocumentById = async ({ id }: { id?: number }) => {
  return client(`/documents/${id}`).then((data) => data);
};

const useDocumentById = ({
  id,
  options,
}: {
  id?: number;
  options?: any;
}): UseQueryResult<DataResponseDocumentByIdType, Error> => {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => fetchDocumentById({ id }),
    ...options,
  });
};

function useCreateDocument({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      clientFormData("/documents", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as UseMutationResult<FormDocumentValues, Error>;
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

function useDeleteDocument({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (updates: { id: number }) =>
      client(`/documents/${updates.id}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

function useDeleteBulkDocument({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (query: { ids: number }) =>
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
