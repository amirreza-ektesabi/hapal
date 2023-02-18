export function objectToArray(value) {
  if (typeof value === "object")
    return Array.prototype.concat.apply(
      [],
      Array.from(Object.keys(value), (key) => value[key])
    );
  else return [value];
}
