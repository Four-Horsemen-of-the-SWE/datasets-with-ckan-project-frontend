import moment from "moment";

export function formatted_date_time(date) {
  const result =
    moment.utc(date).toDate() &&
    moment(moment.utc(date).toDate()).format("MMMM Do YYYY, h:mm:ss a");
  return result;
}

export function formatted_date(date) {
  const result =
    moment.utc(date).toDate() &&
    moment(moment.utc(date).toDate()).format("MMMM Do YYYY");
  return result;
}

export function formatted_date_relative_hour(date) {
  const result =
    moment.utc(date).toDate() &&
    moment(moment.utc(date).toDate()).startOf('hour').fromNow();
  return result;
}

export function formatted_date_custom(date, text) {
  const result =
    moment.utc(date).toDate() &&
    moment(moment.utc(date).toDate()).format(text);
  return result;
}