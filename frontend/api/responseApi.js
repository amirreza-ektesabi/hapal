import axios from "axios";
import objectToArray from "src/general/functions/objectToArray";

function handleReponseSucceed(response) {
  return {
    error: false,
    status: response.status,
    data: response?.data,
  };
}

function handleReponseError(error) {
  let data;
  let response = error.response;
  let status = response?.status;

  if (status === 404 || status === 500) {
    data = ["Something went wrong."];
  } else if (!status || error.message === "Network Error") {
    status = 408;
    data = ["Server is not responding."];
  } else {
    data = objectToArray(response.data);
  }

  return {
    error: true,
    status: status,
    data: data,
  };
}

function logReponseResult(method, url, result) {
  const msg = `\x1b[38;5;198mrequest\x1b[0m - ${method.toUpperCase()} ${url} ${result.status}`;
  console.log(msg);
}

export default async function responseApi(url, method, data) {
  let result;
  try {
    const response = await axios({ method, url, data });
    result = handleReponseSucceed(response);
  } catch (error) {
    result = handleReponseError(error);
  }
  logReponseResult(method, url, result);
  return result;
}
