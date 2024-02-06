// from format "2024-02-06T04:58:23.000+00:00" to "30/06/2023 17:00" Date Format
const UseConvertDateFormat = (inputDate: Date = new Date()) => {
  const dateObj = new Date(inputDate);

  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const hours = String(dateObj.getUTCHours()).padStart(2, "0");
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default UseConvertDateFormat;
