import { DataResponseDashboardType } from "@/interface/dashboard.interface";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { client } from "../client";

const fetchDashboard = async ({ query = {} }) => {
  return client("/dashboard", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useDashboard = ({ query = {}, options }: any = {}): UseQueryResult<
  DataResponseDashboardType,
  Error
> => {
  return useQuery({
    queryKey: ["dashboard", query],
    queryFn: () => fetchDashboard({ query }),
    ...options,
  });
};

export { useDashboard };
