import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { client } from "../client";
import { QueryType } from "@/interface/common";
import { DataResponseNotificationType } from "@/interface/notification.interface";

const fetchNotification = async ({ query, action }: { query?: QueryType; action?: string }) => {
  return client(`/notifications${action ? `/${action}` : ""}`, {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useNotification = ({
  query,
  options,
  action,
}: {
  query?: QueryType;
  options?: any;
  action?: string;
} = {}): UseQueryResult<DataResponseNotificationType, Error> => {
  return useQuery({
    queryKey: ["notifications", query],
    queryFn: () => fetchNotification({ query, action }),
    ...options,
  });
};

export { useNotification };
