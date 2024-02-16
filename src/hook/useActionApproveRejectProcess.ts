export const useActionApproveRejectProcess = (action: string) => {
  switch (action) {
    case "approve":
      return "approve";
    case "reject":
      return "reject";
    default:
      return "process";
  }
};
