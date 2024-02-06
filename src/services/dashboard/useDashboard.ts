import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../client";

const fetchDashboard = async ({ query = {} }) => {
  return client("/dashboard", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useDashboard = ({ query = {}, options }: any = {}) => {
  return useQuery({
    queryKey: ["dashboard", query],
    queryFn: () => fetchDashboard({ query }),
    ...options,
  }) as any;
};

const fetchDashboardById = async ({ id }: { id: string }) => {
  return client(`/dashboard/${id}`).then((data) => data);
};

const useDashboardById = ({ id, options }: any) => {
  return useQuery({
    queryKey: ["dashboard", id],
    queryFn: () => fetchDashboardById({ id }),
    ...options,
  }) as any;
};

function useCreateDashboard({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/dashboard", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useUpdateDashboard({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/dashboard", {
        method: "PUT",
        data: updates,
      }),
    ...options,
  });
}

function useDeleteDashboard({ options }: any) {
  return useMutation({
    mutationFn: (updates) =>
      client("/dashboard", {
        method: "DELETE",
        data: updates,
      }),
    ...options,
  });
}

export {
  useCreateDashboard,
  useDeleteDashboard,
  useDashboard,
  useDashboardById,
  useUpdateDashboard,
};
