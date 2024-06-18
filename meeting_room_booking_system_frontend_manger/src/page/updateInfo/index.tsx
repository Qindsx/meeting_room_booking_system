import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect } from 'react';
import './updateInfo.css';
import { getUserInfo, updateInfo, updateUserInfoCaptcha } from '../../api/user';
import CaptchaButton from '../../component/CaptchaButton';
import { HeadPicUpload } from '../../component/PicUpload';

export interface UserInfo {
    headPic: string;
    nickName: string;
    email: string;
    captcha: string;
}

const layout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

export function UpdateInfo() {
    const [form] = useForm();

    const onFinish = useCallback(async (values: UserInfo) => {
        try {
            const res = await updateInfo(values);

            if (res.status === 201 || res.status === 200) {
                const { message: msg, data } = res.data;
                if (msg === 'success') {
                    message.success('用户信息更新成功');
                } else {
                    message.error(data);
                }
            } else {
                message.error('系统繁忙，请稍后再试');
            }
        } catch (error) {
            message.error('系统繁忙，请稍后再试');
        }
    }, []);

    const sendCaptcha = useCallback(async () => {
        const address = form.getFieldValue('email')
        if (!address) {
            return message.error('请输入邮箱地址');
        }
        debugger
        const resp = await updateUserInfoCaptcha()
        return resp
    }, [])

    useEffect(() => {
        async function query() {
            try {
                const res = await getUserInfo()

                const { data } = res.data;

                if (res.status === 201 || res.status === 200) {
                    form.setFieldValue('headPic', data.headPic);
                    form.setFieldValue('nickName', data.nickName);
                    form.setFieldValue('email', data.email);
                }
            } catch (error) {
                console.log(error)
            }
        }
        query()
    }, [])


    return <div id="updateInfo-container">
        <h1>用户信息修改</h1>
        <Form
            form={form}
            {...layout1}
            onFinish={onFinish}
            colon={false}
            autoComplete="off"
        >
            <Form.Item
                label="头像"
                name="headPic"
                rules={[
                    { required: true, message: '请上传头像!' },
                ]}
            >
                <HeadPicUpload value={form.getFieldValue('headPic')}></HeadPicUpload>
            </Form.Item>

            <Form.Item
                label="昵称"
                name="nickName"
                rules={[
                    { required: true, message: '请输入昵称!' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="邮箱"
                name="email"
                rules={[
                    { required: true, message: '请输入邮箱!' },
                    { type: "email", message: '请输入合法邮箱地址!' }
                ]}
            >
                <Input disabled />
            </Form.Item>

            <div className='captcha-wrapper'>
                <Form.Item
                    label="验证码"
                    name="captcha"
                    rules={[{ required: true, message: '请输入验证码!' }]}
                >
                    <Input />
                </Form.Item>
                <CaptchaButton countdownDuration={30} requestCallback={sendCaptcha}></CaptchaButton>
                {/* <Button type="primary" onClick={sendCaptcha}>发送验证码</Button> */}
            </div>

            <Form.Item
                {...layout1}
                label=" "
            >
                <Button className='btn' type="primary" htmlType="submit">
                    确认修改
                </Button>
            </Form.Item>
        </Form>
    </div>
}
