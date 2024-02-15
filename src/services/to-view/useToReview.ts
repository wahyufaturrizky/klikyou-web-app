import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { client, clientFormData } from "../client";
import { DataResponseToReviewType } from "@/interface/to-review.interface";

const fetchToReview = async ({ query = {} }) => {
  return client("/documents/approval", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useToReview = ({ query = {}, options }: any = {}): UseQueryResult<
  DataResponseToReviewType,
  Error
> => {
  return useQuery({
    queryKey: ["documents-approval", query],
    queryFn: () => fetchToReview({ query }),
    ...options,
  });
};

const fetchToReviewById = async ({ id }: { id: string }) => {
  return client(`/documents/approval/${id}`).then((data) => data);
};

const useToReviewById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["documents-approval", id],
    queryFn: () => fetchToReviewById({ id }),
    ...options,
  }) as any;
};

function useCreateToReview({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/documents/approval", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateToReview({ options, id }: any) {
  return useMutation({
    mutationFn: (updates) =>
      clientFormData(`/documents/approve/${id}`, {
        method: "POST",
        data: updates,
      }),
    ...options,
  }) as any;
}

function useDeleteToReview({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/documents/approval", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export { useCreateToReview, useDeleteToReview, useToReview, useToReviewById, useUpdateToReview };
