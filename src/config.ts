import { CookieAttributes } from "node_modules/@types/js-cookie";

const now = new Date();
  const expireTime = now.getTime() + 30 * 60 * 1000; // 30 minutes in milliseconds
  const expirationDate = new Date(expireTime);
export const coookie_options : CookieAttributes  = {
    expires: expirationDate,
    secure: false,
    sameSite: "lax",
    domain: window.location.hostname,
  };
  export const request_cookie_options : CookieAttributes  = {
    expires: expireTime,
    secure: false,
    sameSite: "lax",
    domain: window.location.hostname,
  };
//export const API_BASE_URL = "http://192.168.23.84:8007/ddcic/api/v1";
export const API_BASE_URL = "http://210.213.193.4:8007/ddcic/api/v1";

 const hostname = window.location.hostname 
 const port = window.location.port
 const protocol = window.location.protocol
 const domain =  port.length > 0 ? protocol + "//" + hostname + ":" + port :  protocol + "//" + hostname

 export const APP_DOMAIN = domain