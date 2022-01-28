// return the user data from the local storage
export const getUser = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

// remove the user from the local storage
export const removeUserSession = () => {
  localStorage.removeItem("user");
};

// set the user to the local storage
export const setUserSession = (user) => {
  localStorage.setItem("user", JSON.stringify(user));  // we don't want to store token in local storage for security reasons
};
