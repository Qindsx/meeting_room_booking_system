import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 3000
});

axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers.authorization = 'Bearer ' + accessToken;
    }
    return config;
});

interface PendingTask {
    config: AxiosRequestConfig;
    resolve: Function;
    reject: Function;
}

let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (!error.response) {
            return Promise.reject(error);
        }
        const { data, config } = error.response;

        if (refreshing) {
            return new Promise((resolve, reject) => {
                queue.push({ config, resolve, reject });
            });
        }

        if (data.code === 401 && !config.url.includes('/user/refresh')) {
            debugger
            
            refreshing = true;

            try {
                const res = await refreshToken();
                refreshing = false;
                if (res.status === 200) {
                    queue.forEach(({ config, resolve }) => {
                        resolve(axiosInstance(config));
                    });
                    queue.length = 0; // Clear the queue after processing
                    return axiosInstance(config);
                } else {
                    queue.forEach(({ reject }) => {
                        reject(error);
                    });
                    queue.length = 0;
                    message.error(res.data);
                    setTimeout(() => {
                        debugger
                        window.location.href = '/login';
                    }, 1500);
                    return Promise.reject(error);
                }
            } catch (err) {
                refreshing = false;
                queue.forEach(({ reject }) => {
                    reject(err);
                });
                queue.length = 0;
                setTimeout(() => {
                    debugger
                    window.location.href = '/login';
                }, 1500);
                return Promise.reject(err);
            }
        } else {
            return Promise.reject(error);
        }
    }
);

export async function refreshToken() {
    const res = await axiosInstance.get('/user/refresh', {
        params: {
            refresh_token: localStorage.getItem('refresh_token')
        }
    });
    localStorage.setItem('access_token', res.data.access_token || '');
    localStorage.setItem('refresh_token', res.data.refresh_token || '');
    return res;
}

export default axiosInstance;
