import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { client } from "../client";
import { QueryType } from "@/interface/common";
import { DataResponseNotificationType } from "@/interface/notification.interface";

const fetchNotification = async ({ query }: { query?: QueryType }) => {
  return client("/notifications", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useNotification = ({
  query,
  options,
}: {
  query?: QueryType;
  options?: any;
} = {}): UseQueryResult<DataResponseNotificationType, Error> => {
  return useQuery({
    queryKey: ["notifications", query],
    queryFn: () => fetchNotification({ query }),
    ...options,
  });
};

const fetchNotificationById = async ({ query, id }: { query?: QueryType; id?: string }) => {
  return client(`/notifications/${id}`, {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useNotificationById = ({
  query,
  options,
  id,
}: {
  query?: QueryType;
  options?: any;
  id?: string;
} = {}): UseQueryResult<DataResponseNotificationType, Error> => {
  return useQuery({
    queryKey: ["notifications-by-id", query],
    queryFn: () => fetchNotificationById({ query, id }),
    ...options,
  });
};

const fetchNotificationMarkReadAll = async ({ query }: { query?: QueryType }) => {
  return client("/notifications/read-all", {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useNotificationMarkReadAll = ({
  query,
  options,
}: {
  query?: QueryType;
  options?: any;
} = {}): UseQueryResult<DataResponseNotificationType, Error> => {
  return useQuery({
    queryKey: ["notifications-mark-read-all", query],
    queryFn: () => fetchNotificationMarkReadAll({ query }),
    ...options,
  });
};

export { useNotification, useNotificationMarkReadAll, useNotificationById };
