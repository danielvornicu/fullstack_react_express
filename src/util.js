  
//let jwt_decode = require("jwt-decode"); //ES5 syntax 
import jwt_decode from "jwt-decode"; //ES2015 (ES6)

export const updateAppSettings = (token) => {
  //localStorage.clear();
  if (token) {
    //console.log(token);
    localStorage.setItem("displayName", jwt_decode(token)["sub"]);
    localStorage.setItem("access_token", token);
  }
};

export const isAdmin = () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    const audience = jwt_decode(token)["aud"];
    return audience.includes("SHOW_USERS") && audience.includes("ADD_USER");
  }
};

export const isMember = () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    const audience = jwt_decode(token)["aud"];
    return !audience.includes("SHOW_USERS") && !audience.includes("ADD_USER");
  }
};


//contruct header contentType is optional
export const constructHeader = (contentType) => {
  const auth = "Bearer " + localStorage.getItem("access_token") || "";
  return contentType
    ? { "Content-type": contentType, Authorization: auth }
    : { Authorization: auth };
};