import axios from "axios";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BASE_API_URL
});

export default axiosInstance;
