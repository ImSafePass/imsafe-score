const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const spelled = (date: Date) => {
  const month = months[date.getMonth()];
  return `${month} ${date.getDate()}`;
};

export const spelledWithYear = (date: Date) => {
  const month = months[date.getMonth()];
  return `${month} ${date.getDate()}, ${date.getFullYear()}`;
};

export const brief = (date: Date) => date.toISOString().split("T")[0];

export const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());

export const daysFrom = (dayNum: number, date: Date = new Date()) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + dayNum);
  return newDate;
};
