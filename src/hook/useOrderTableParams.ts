export const useOrderTableParams = (order: any) => {
  if (order?.field) {
    return `${order.field}_${order.order === "ascend" ? "asc" : "desc"}`;
  } else {
    return "";
  }
};
