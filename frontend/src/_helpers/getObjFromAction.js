export function getObjFromAction(state, action) {
  let obj;
  if (Object.hasOwn(action, "meta")) {
    const isError = action.payload.error;
    const arg = action.meta.arg;
    obj = !isError ? state.entities[arg] : null;
  } else {
    const arg = action.payload;
    obj = state.entities[action.payload];
  }
  return obj;
}
