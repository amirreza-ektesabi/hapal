import { stringFormat } from "./stringFormat";

const appName = "Hapal";

export function pageTitle(pageNameFormat, ...extraData) {
  const pageName =
    pageNameFormat && pageNameFormat.includes("{0}")
      ? extraData && extraData.every((obj) => obj)
        ? stringFormat(pageNameFormat, ...extraData)
        : undefined
      : pageNameFormat;
  return pageName ? `${pageName} – ${appName}` : appName;
}
