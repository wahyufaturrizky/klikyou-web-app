export const UseBgColorStatus = (val: string) => {
  if (typeof val === "string") {
    if (val?.includes("Partially approved")) {
      return "bg-link";
    } else if (
      val?.includes("Waiting Approval") ||
      val?.includes("uploaded") ||
      val?.includes("updated")
    ) {
      return "bg-gray-dark";
    } else if (val?.includes("Fully approved")) {
      return "bg-green";
    } else if (val?.includes("Partially processed")) {
      return "bg-brand-dark";
    } else if (val?.includes("Fully Processed")) {
      return "bg-primary-purple";
    }
  } else {
    return "";
  }
};
