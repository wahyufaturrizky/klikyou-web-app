import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchProcessed = async ({ query = {} }) => {
  return client("/received/processed", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useProcessed = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["processed", query],
    queryFn: () => fetchProcessed({ query }),
    ...options,
  }) as any;
};

const fetchProcessedById = async ({ id }: { id: string }) => {
  return client(`/received/processed/${id}`).then((data) => data);
};

const useProcessedById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["processed", id],
    queryFn: () => fetchProcessedById({ id }),
    ...options,
  }) as any;
};

function useCreateProcessed({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/received/processed", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateProcessed({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/received/processed", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteProcessed({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/received/processed", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export {
  useCreateProcessed,
  useDeleteProcessed,
  useProcessed,
  useProcessedById,
  useUpdateProcessed,
};
