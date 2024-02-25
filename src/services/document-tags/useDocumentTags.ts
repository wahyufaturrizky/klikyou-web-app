import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";
import {
  DataResponseDocumentTagType,
  FormDocumentTagsValues,
} from "@/interface/documents-tag.interface";
import { QueryType } from "@/interface/common";

const fetchDocumentTags = async ({ query }: { query?: QueryType }) => {
  return client("/master-document-tags", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useDocumentTags = ({
  query,
  options,
}: {
  query?: QueryType;
  options?: any;
}): UseQueryResult<DataResponseDocumentTagType, Error> => {
  return useQuery({
    queryKey: ["document-tags", query],
    queryFn: () => fetchDocumentTags({ query }),
    ...options,
  });
};

function useCreateDocumentTags({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (reqBody: FormDocumentTagsValues) =>
      client("/master-document-tags", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as UseMutationResult<FormDocumentTagsValues, Error>;
}

function useUpdateDocumentTags({ options, id }: { options?: any; id: number }) {
  return useMutation({
    mutationFn: (updates) =>
      client(`/master-document-tags/${id}`, {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as UseMutationResult<FormDocumentTagsValues, Error>;
}

function useDeleteDocumentTags({ options }: { options?: any }) {
  return useMutation({
    mutationFn: (query: { ids: string }) =>
      client(`/master-document-tags?ids=${query.ids}`, {
        method: "DELETE",
      }),
    ...options,
  });
}

export { useCreateDocumentTags, useDocumentTags, useUpdateDocumentTags, useDeleteDocumentTags };
