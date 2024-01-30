// 30/06/2023 17:00 Date Format
const UseDateTimeFormat = (date: Date = new Date()) => {
  // Extract date and time components
  let day: number | string = date.getDate();
  let month: number | string = date.getMonth() + 1; // Months are zero-based, so add 1
  let year: number | string = date.getFullYear();
  let hours: number | string = date.getHours();
  let minutes: number | string = date.getMinutes();

  // Pad single-digit values with leading zeros
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  // Format the date and time string
  let formattedDate = day + "/" + month + "/" + year + " " + hours + ":" + minutes;

  return formattedDate;
};

export default UseDateTimeFormat;
