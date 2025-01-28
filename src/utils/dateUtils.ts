export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month: string | number = today.getMonth() + 1;
  let day: string | number = today.getDate();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  const formattedToday = year + "-" + month + "-" + day;

  return formattedToday;
}
