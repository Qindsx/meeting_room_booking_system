import axiosInstance from "./interfaces";

export async function freeze(id: number, isFrozen: boolean) {
    return await axiosInstance.post('/user/freeze', {
        id,
        isFrozen
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