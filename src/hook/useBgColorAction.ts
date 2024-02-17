export const UseBgColorAction = (val: string) => {
  if (typeof val === "string") {
    if (val?.includes("Rejected")) {
      return "bg-red";
    } else if (val?.includes("Approved")) {
      return "bg-green";
    } else if (val?.includes("Updated")) {
      return "bg-warn";
    } else if (val?.includes("Uploaded")) {
      return "bg-link";
    } else if (val?.includes("upload")) {
      return "bg-link";
    } else if (val?.includes("pending")) {
      return "bg-link";
    }
  }
};
