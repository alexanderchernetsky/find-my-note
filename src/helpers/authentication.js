export const getUser = () => {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
};

export const getToken = () => {
    return sessionStorage.getItem('token');
};

export const removeUserSession = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
};

export const setUserSession = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
};
