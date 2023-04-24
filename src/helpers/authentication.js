export const getUser = () => {
    const user = sessionStorage.getItem('user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
};

export const getToken = () => {
    return sessionStorage.getItem('token');
};

export const removeUserSession = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
};

export const setUserSession = (user, token) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
};
