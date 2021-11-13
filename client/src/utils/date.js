/**
 * Convert time from ISO8601 to a `DD/MM/YYYY`
 * date format and `HH:mm` time format
 *
 * @param {string} dateTime ISO timestamp
 * @return an object with `date` and `time` converted
 */
export function ISOtoHuman(dateTime) {
  const date = new Date(
    dateTime.substring(0, 4),
    dateTime.substring(5, 7) - 1,
    dateTime.substring(8, 10)
  );

  const time = dateTime.substring(11, 13);

  return { date, time };
}

/**
 * Convert time from `DD/MM/YYYY` and `HH:mm` in ISO8601
 *
 * @param {Date} date
 * @param {number} time
 * @return date and time in a ISO string
 */
export function humanToISO(date, time) {
  const dateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time
  );

  return dateTime.toISOString();
}
