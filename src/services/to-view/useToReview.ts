import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchToReview = async ({ query = {} }) => {
  return client("/approvals-to-review", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useToReview = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["to-review", query],
    queryFn: () => fetchToReview({ query }),
    ...options,
  }) as any;
};

const fetchToReviewById = async ({ id }: { id: string }) => {
  return client(`/approvals-to-review/${id}`).then((data) => data);
};

const useToReviewById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["to-review", id],
    queryFn: () => fetchToReviewById({ id }),
    ...options,
  }) as any;
};

function useCreateToReview({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/approvals-to-review", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateToReview({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/approvals-to-review", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  }) as any;
}

function useDeleteToReview({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/approvals-to-review", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export { useCreateToReview, useDeleteToReview, useToReview, useToReviewById, useUpdateToReview };
