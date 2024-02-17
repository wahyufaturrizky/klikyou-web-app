export const UseBgColorStatus = (val: string) => {
  if (typeof val === "string") {
    if (
      val?.includes("Partially approved") ||
      val?.includes("uploaded") ||
      val?.includes("updated") ||
      val?.includes("Partially processed")
    ) {
      return "bg-link";
    } else if (val?.includes("Waiting Approval")) {
      return "bg-gray-dark";
    } else if (val?.includes("Fully approved")) {
      return "bg-green";
    } else if (val?.includes("Fully Processed")) {
      return "bg-primary-purple";
    }
  }
};
