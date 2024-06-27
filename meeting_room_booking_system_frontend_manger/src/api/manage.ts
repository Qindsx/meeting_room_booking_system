import axiosInstance from "./interfaces";

export async function searchManage( name:string,capacity:string,equipment:string,pageNo: number, pageSize: number) {
    return await axiosInstance.get('/meeting-room/list', {
      params:{
        name,
        capacity,
        equipment,
        pageNo,
        pageSize
      }
    });
}