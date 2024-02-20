export const UseBgColorStatus = (val: string) => {
  if (typeof val === "string") {
    if (val?.includes("Partially approved")) {
      return "bg-link";
    } else if (
      val?.includes("Waiting Approval") ||
      val?.includes("Uploaded") ||
      val?.includes("upload") ||
      val?.includes("update") ||
      val?.includes("Updated")
    ) {
      return "bg-gray-dark";
    } else if (val?.includes("Fully approved") || val?.includes("approved")) {
      return "bg-green";
    } else if (val?.includes("Partially processed") || val?.includes("processed")) {
      return "bg-secondary-blue";
    } else if (val?.includes("Fully processed")) {
      return "bg-primary-purple";
    }
  } else {
    return "";
  }
};
