export function truncate(string, maxLength) {
  return string.length <= maxLength
    ? string
    : string.substring(0, maxLength) + "...";
}
