import * as moment from "moment";

/**
 * toHHMMSS
 * turns an amount of seconds into days, hours, minutes seconds
 * @param {number} inctime - an amount of seconds to be formatted
 * @return {string} 'dd:hh:mm:ss' days, hours, minutes seconds returned as a string
 */
function toDDHHMMSS(inctime: number): string {
  let time = inctime;
  const days = Math.floor(time / 86400);
  time -= days * 86400;
  const hours = Math.floor(time / 3600);
  time -= hours * 3600;
  const minutes = Math.floor(time / 60);
  time -= minutes * 60;
  const seconds = Math.floor(time % 60);
  return `${days.toString().padStart(2, "0")}:${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * formatMoney
 * takes a number and formats it to USD
 * @param {number} unformattedMoney - a number to format
 * @returns {string} - a formatted string
 * @example
 * formatMoney(1234567890) // returns $1,234,567,890.00
 */
function formatMoney(unformattedMoney: any): string {
  const formatMoney = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(unformattedMoney);

  return formatMoney;
}

/**
 * formatPast
 * takes a time stamp from the past and calculates the hh:mm:ss it was in the past
 * @param {string} intDate - a time stamp in the past in seconds
 **/
function formatPast(intDate: any) {
  const timestamp = moment.unix(intDate);
  const now = moment.unix(new Date().getTime() / 1000);
  const difference = now.diff(timestamp);
  const duration = moment.duration(difference);
  return (
    Math.floor(duration.asHours()) + moment.utc(difference).format(":mm:ss")
  );
}

export { toDDHHMMSS, formatMoney, formatPast };
