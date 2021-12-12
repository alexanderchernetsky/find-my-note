// return the user data from the local storage
export const getUser = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

// return the token from the local storage
export const getToken = () => {
  return localStorage.getItem("token") || null;
};

// remove the token and user from the local storage
export const removeUserSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// set the token and user to the local storage
export const setUserSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};
