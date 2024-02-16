export const UseBgColorStatus = (val: string) => {
  if (val?.includes("Partially Approved")) {
    return "bg-link";
  } else if (val?.includes("Waiting Approval")) {
    return "bg-gray-dark";
  } else if (val?.includes("Fully Approved")) {
    return "bg-green";
  } else if (val?.includes("Fully Processed")) {
    return "bg-primary-purple";
  }
};
