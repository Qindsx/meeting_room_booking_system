import { InboxOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { DraggerProps } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import { uploadFile } from "../api/upload";
import { UploadRequestOption, UploadRequestError } from 'rc-upload/lib/interface';
import { useEffect, useState } from "react";


interface HeadPicUploadProps {
    value?: string;
    onChange?: (newPath: string) => void
}

const BASE_URL = process.env.REACT_APP_API_URL
const DEFAULT_PATH = process.env.REACT_APP_IMG_DEFAULT_PATH

const draggerProps: DraggerProps = {
    name: 'file',
    maxCount: 1,
    accept: '.jpg, .jpeg, .png'
};

const handleUpload = async (options: UploadRequestOption, onChange?: (newPath: string) => void) => {

    try {
        const { data } = await uploadFile(options.file)
        options.onSuccess?.(data);
        if (onChange) {
            onChange(data.data.filePath)
        }
    } catch (error) {
        options.onError?.(error as any)
    }
}


const dragger = (props: DraggerProps, onChange: (newPath: string) => void) => {

    const handleRemoved =()=>{
        // 删除后给一个默认头像
        onChange(DEFAULT_PATH || '')
    }
    
    return <Dragger
        {...props}
        customRequest={(options) => handleUpload(options, onChange)}
        onRemove={handleRemoved}
    >
        <p className="ant-upload-drag-icon">
            <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
    </Dragger>
}

export function HeadPicUpload(props: HeadPicUploadProps) {
    const [imgPath, setImgPath] = useState<string | undefined>(props.value)

    useEffect(() => {
        setImgPath(props.value)
    }, [props.value])

    const handleChange = (newPath: string) => {
        setImgPath(newPath)
        if (props.onChange) {
            props.onChange(newPath);
        }
    }

    return imgPath ? <div>
        <img src={BASE_URL + imgPath} alt="" width="100" height="100" />
        {dragger(draggerProps, handleChange)}
    </div> : <div>
        {dragger(draggerProps, handleChange)}
    </div>
}