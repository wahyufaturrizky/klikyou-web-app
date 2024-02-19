export const UseBgColorAction = (val: string) => {
  if (typeof val === "string") {
    if (val?.includes("Rejected")) {
      return "bg-red";
    } else if (val?.includes("Approved")) {
      return "bg-green";
    } else if (val?.includes("Updated") || val?.includes("update")) {
      return "bg-warn";
    } else if (val?.includes("Uploaded") || val?.includes("upload") || val?.includes("pending")) {
      return "bg-gray-dark";
    }
  } else {
    return "";
  }
};
