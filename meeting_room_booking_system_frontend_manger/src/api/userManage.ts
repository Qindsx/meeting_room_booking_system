import axiosInstance from "./interfaces";

export async function freeze(id: number) {
    return await axiosInstance.get('/user/freeze', {
        params: {
            id
        }
    });
}
export async function userSearch(username: string, nickName: string, email: string, pageNo: number, pageSize: number) {
    return await axiosInstance.get('/user/list', {
        params: {
            username,
            nickName,
            email,
            pageNo,
            pageSize
        }
    });
}