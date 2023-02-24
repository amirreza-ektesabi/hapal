import messages from "src/general/messages";

function validateEmail(str) {
  return String(str)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function validateUsername(str) {
  return String(str).match(/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/);
}

function validatePassword(str) {
  return String(str).match(/^.{8,128}$/);
}

export function validateSignupForm(data) {
  let msg = null;

  if (!validateUsername(data.username)) msg = messages.invalidUsername;
  else if (!validateEmail(data.email)) msg = messages.invalidEmail;
  else if (!validatePassword(data.password)) msg = messages.invalidPassword;
  else if (data.password !== data.confirmPassword)
    msg = messages.passwordsNotMatching;

  return { error: msg !== null, msg: msg };
}
