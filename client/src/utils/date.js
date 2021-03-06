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
  const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time);

  return dateTime.toISOString();
}

/**
 * Check if the virtual time is in the interval: Sat, 9am - Sun, 11pm.
 * If so, orders can be made by clients.
 *
 * @param {Date} virtualTime
 * @return {boolean} true if the client can order, false otherwise
 */
export function checkOrderInterval(virtualTime) {
  const dayOfWeek = virtualTime.getDay(); // Sunday ... Saturday -> 0 ... 6
  const timeOfDay = virtualTime.getHours(); // 0 ... 23

  if (dayOfWeek === 6 && timeOfDay >= 10) {
    return true;
  } else if (dayOfWeek === 0 && timeOfDay < 24) {
    return true;
  } else {
    return false;
  }
}

/**
 * Check if the virtual time is in the interval: Wed - Sat, 9am.
 * If so, farmers can insert available products for the next week.
 *
 * @param {Date} virtualTime
 * @return {boolean} true if the farmer can insert products, false otherwise
 */
export function checkSupplyInterval(virtualTime) {
  const dayOfWeek = virtualTime.getDay(); // Sunday ... Saturday -> 0 ... 6
  const timeOfDay = virtualTime.getHours(); // 0 ... 23

  if (dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5) {
    return true;
  } else if (dayOfWeek === 6 && timeOfDay < 10) {
    return true;
  } else {
    return false;
  }
}
