import { RegisterUser } from "../page/register";
import axiosInstance from "./interfaces";

export async function login(username: string, password: string) {
    return await axiosInstance.post('/user/login', {
        username, password
    });
}

// 获取邮箱验证码
export async function getCaptcha(email: string) {
    return await axiosInstance.get('/user/register-captcha', {
     params:{
        address:email
     }   
    });
}

// 注册
export async function register(registerUser: RegisterUser) {
    return await axiosInstance.post('/user/register', registerUser);
}