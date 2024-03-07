// from format "2024-02-06T04:58:23.000+00:00" to "30/06/2023 17:00" Date Format
const UseConvertDateFormat = (inputDate: Date | string): string | undefined => {
  if (inputDate) {
    const dateObj = typeof inputDate === "string" ? new Date(inputDate) : inputDate;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
};

export default UseConvertDateFormat;
