import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchToDo = async ({ query = {} }) => {
  return client("/received/to-do", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useToDo = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["to-do", query],
    queryFn: () => fetchToDo({ query }),
    ...options,
  }) as any;
};

const fetchToDoById = async ({ id }: { id: string }) => {
  return client(`/received/to-do/${id}`).then((data) => data);
};

const useToDoById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["to-do", id],
    queryFn: () => fetchToDoById({ id }),
    ...options,
  }) as any;
};

function useCreateToDo({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/received/to-do", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateToDo({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/received/to-do", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteToDo({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/received/to-do", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export { useCreateToDo, useDeleteToDo, useToDo, useToDoById, useUpdateToDo };
