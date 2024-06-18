import { Button, Form, Input, message } from "antd"
import './register.css'
import { useForm } from "antd/es/form/Form"
import { getCaptcha, register } from "../../api/user"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import CaptchaButton from "../../component/CaptchaButton"

export interface RegisterUser {
    username: string
    nickName: string
    password: string
    confirmPassword: string
    captcha: string
    email: string
}

const onFinish = async (values: RegisterUser) => {
    try {
        const res = await register({ ...values })
    } catch (error) {

    }
}

const layout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
}

// 验证码60倒计时
export function Register() {
    const [form] = useForm()
    // 邮箱发送
    const sendCaptcha = useCallback(async () => {
        const address = form.getFieldValue('email')
        if (!address) {
            return message.error('请输入邮箱地址');
        }
        const resp = await getCaptcha(address)
        return resp
    }, [])

    return <div id="register-container">
        <h1>会议室预订系统</h1>
        <Form
            form={form}
            {...layout1}
            onFinish={onFinish}
            colon={false}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: "请输入用户名" }]}
            >
                <Input></Input>
            </Form.Item>
            <Form.Item
                label="昵称"
                name="nickName"
                rules={[{ required: true, message: "请输入昵称" }]}
            >
                <Input></Input>
            </Form.Item>
            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入用密码" }]}
            >
                <Input.Password></Input.Password>
            </Form.Item>
            <Form.Item
                label="确认密码"
                name="confirmPassword"
                rules={[{ required: true, message: "请输入确认密码" }]}
            >
                <Input.Password></Input.Password>
            </Form.Item>
            <Form.Item
                label="邮箱"
                name="email"
                rules={[{ required: true, message: "请输入邮箱" }, { type: 'email', message: '请输入正确邮箱' }]}
            >
                <Input></Input>
            </Form.Item>
            <div className="captcha-wrapper">
                <Form.Item
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                    className="captcha-input"
                    label="邮箱验证码"
                    name="captcha"
                    rules={[{ required: true, message: "请输入验证码" }]}
                >
                    <Input></Input>
                </Form.Item>
                {/* <Button disabled={captchaDisable} loading={captchaBtnLoading} type="primary" onClick={sendCaptcha} >
                    {captchaDisable ? countdownNumber : ''} 获取验证码
                </Button> */}
                <CaptchaButton countdownDuration={30} requestCallback={sendCaptcha}></CaptchaButton>
            </div>
            <Form.Item
                {...layout2}
            >
                <div className='links'>
                    已有账号？去<Link to="/login">登录</Link>
                </div>
            </Form.Item>
            <Form.Item
                {...layout1}
                label=" "
            >
                <Button className='btn' type="primary" htmlType="submit">
                    注册
                </Button>
            </Form.Item>
        </Form >
    </div >
}