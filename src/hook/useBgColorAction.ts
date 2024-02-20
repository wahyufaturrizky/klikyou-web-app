export const UseBgColorAction = (val: string) => {
  if (typeof val === "string") {
    if (val?.includes("Rejected")) {
      return "bg-red";
    } else if (val?.includes("Approved") || val?.includes("Fully approved")) {
      return "bg-green";
    } else if (val?.includes("Updated")) {
      return "bg-warn";
    } else if (val?.includes("Partially approved")) {
      return "bg-link";
    } else if (val?.includes("Partially processed")) {
      return "bg-brand-dark";
    } else if (val?.includes("Fully processed")) {
      return "bg-primary-purple";
    } else if (
      val?.includes("Uploaded") ||
      val?.includes("upload") ||
      val?.includes("pending") ||
      val?.includes("Updated") ||
      val?.includes("update")
    ) {
      return "bg-gray-dark";
    }
  } else {
    return "";
  }
};
