//  "Fri, 23 Feb 2024 05:54:04 GMT" to "2024-02-23"
export const useDateRangeFormat = (inputDateString: Date) => {
  if (inputDateString) {
    let date = new Date(inputDateString);
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
    let day = ("0" + date.getDate()).slice(-2);

    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
};
