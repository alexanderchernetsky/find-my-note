import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BASE_API_URL
});

export const setUpAuthHeader = ({tokenType, accessToken}) => {
    axiosInstance.defaults.headers.Authorization = `${tokenType} ${accessToken}`;
};

export const removeAuthHeader = () => {
    delete axiosInstance.defaults.headers.Authorization;
};

export default axiosInstance;
