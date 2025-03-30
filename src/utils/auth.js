export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
};

export const decodeJWT = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("Invalid JWT format");
    return null;
  }
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedData = JSON.parse(atob(base64));
  return decodedData;
};
