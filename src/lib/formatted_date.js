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