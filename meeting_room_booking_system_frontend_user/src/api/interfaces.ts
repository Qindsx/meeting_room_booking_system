import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/',
    timeout: 3000
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        return error.response;
    }
);
export default axiosInstance
