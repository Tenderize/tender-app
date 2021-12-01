// based on https://stackoverflow.com/questions/59494037/how-to-detect-the-device-on-react-ssr-app-with-next-js
import { useEffect, useState } from "react";

const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  const mq = (query: string) => {
    return typeof window !== "undefined" && window.matchMedia(query).matches;
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if ("ontouchstart" in window || (window?.DocumentTouch && document instanceof DocumentTouch)) return true;
  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(""); // include the 'heartz' - https://git.io/vznFH
  return mq(query);
};

export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const { isAndroid, isIPad13, isIPhone13, isWinPhone, isMobileSafari, isTablet } = require("react-device-detect");
    console.log(
      "isAndroid",
      isAndroid,
      "isIPad13",
      isIPad13,
      "isIPhone13",
      isIPhone13,
      "isWinPhone",
      isWinPhone,
      "isMobileSafari",
      isMobileSafari,
      "isTablet",
      isTablet
    );
    setIsTouch(
      (prevIsTouch) =>
        prevIsTouch ||
        isAndroid ||
        isIPad13 ||
        isIPhone13 ||
        isWinPhone ||
        isMobileSafari ||
        isTablet ||
        isTouchDevice()
    );
  }, []);

  return isTouch;
};
