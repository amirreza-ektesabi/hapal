export default function pluralize(count, noun, suffix = "s") {
  return noun + (count !== 1 ? suffix : "");
}
