import axiosInstance from "./interfaces";
import { UploadRequestOption } from 'rc-upload/lib/interface';


export async function uploadFile(file: string | Blob) {
    const formData = new FormData()
    formData.append('file', file)

    return await axiosInstance.post('/upload/file',formData,{headers: {'Content-Type': 'multipart/form-data'}})
}