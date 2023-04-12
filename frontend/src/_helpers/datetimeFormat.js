export function dateFormat(datetime) {
  let obj = new Date(datetime);
  return Intl.DateTimeFormat("default", {
    year: "2-digit",
    month: "short",
    day: "numeric",
  }).format(obj);
}

export function timeFormat(datetime) {
  let obj = new Date(datetime);
  return Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(obj);
}

export function fullFormat(datetime) {
  return timeFormat(datetime) + " · " + dateFormat(datetime);
}

export function timeAgo(datetime) {
  let obj = new Date(datetime);
  let now = Date.now();
  let diff = (now - obj) / 1000;

  if (diff < 0) return dateFormat(datetime);
  else if (diff < 60) return "just now";
  else if (diff < 3600) return `${~~(diff / 60)}m`;
  else if (diff < 86400) return `${~~(diff / 3600)}h`;
  else if (diff < 604800) return `${~~(diff / 86400)}d`;
  else if (diff < 2419200) return `${~~(diff / 604800)}w`;
  return dateFormat(datetime);
}
