export const UseBgColorAction = (val: string) => {
  if (typeof val === "string") {
    if (val?.includes("Rejected") || val?.includes("rejected")) {
      return "bg-red";
    } else if (
      val?.includes("Approved") ||
      val?.includes("Fully approved") ||
      val?.includes("approved")
    ) {
      return "bg-green";
    } else if (val?.includes("Partially approved")) {
      return "bg-link";
    } else if (val === "processed" || val?.includes("Partially processed")) {
      return "bg-secondary-blue";
    } else if (val?.includes("Fully processed")) {
      return "bg-primary-purple";
    } else if (
      val?.includes("Uploaded") ||
      val?.includes("upload") ||
      val?.includes("pending") ||
      val?.includes("Updated") ||
      val?.includes("update") ||
      val?.includes("Waiting Approval")
    ) {
      return "bg-gray-dark";
    }
  } else {
    return "";
  }
};
