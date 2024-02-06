import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchHistory = async ({ query = {} }) => {
  return client("/approvals/history", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useHistory = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["history", query],
    queryFn: () => fetchHistory({ query }),
    ...options,
  }) as any;
};

const fetchHistoryById = async ({ id }: { id: string }) => {
  return client(`/approvals/history/${id}`).then((data) => data);
};

const useHistoryById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["history", id],
    queryFn: () => fetchHistoryById({ id }),
    ...options,
  }) as any;
};

function useCreateHistory({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/approvals/history", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateHistory({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/approvals/history", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteHistory({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/approvals/history", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export { useCreateHistory, useDeleteHistory, useHistory, useHistoryById, useUpdateHistory };
