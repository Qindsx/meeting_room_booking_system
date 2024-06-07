import { Button, Form, Input, message } from "antd"
import './register.css'
import { useForm } from "antd/es/form/Form"
import { getCaptcha, register } from "../../api/user"
import { useCallback, useEffect, useState } from "react"
import useTimeout from "../../hooks/setTimeout"
import { Link } from "react-router-dom"

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

    // loading
    const [captchaBtnLoading, setCaptchaBtnLoading] = useState<boolean>(false)
    // 发送成功后 需要禁用发送按钮60秒
    const [captchaDisable, setCaptchaDisable] = useState(false)
    // 倒计时
    const [countdownNumber, setCountdownNumber] = useState(0)

    // 邮箱发送
    const sendCaptcha = useCallback(async () => {
        const address = form.getFieldValue('email')
        if (!address) {
            return message.error('请输入邮箱地址');
        }
        setCaptchaBtnLoading(true)
        try {
            const { data, status } = await getCaptcha(address)
            if (status == 200 || status == 201) {
                message.success(data.data)
                setCaptchaBtnLoading(false)
                setCaptchaDisable(true)
                setCountdownNumber(30)
            } else {
                setCaptchaBtnLoading(false)
                message.error(data.data || '系统繁忙，请稍后再试');
            }
        } catch (error) {
            setCaptchaBtnLoading(false)
            message.error('网络错误，请重试')
        }
    }, [])

    // 验证码60秒倒计时
    useEffect(() => {
        if (captchaDisable) {
            setTimeout(() => {
                setCaptchaDisable(false)
            }, 30000)
        }
    }, [captchaDisable])

    // 
    useEffect(()=>{
        if(countdownNumber<=0) {
            return
        }
        if(captchaDisable) {
            const timerId = setInterval(()=>{
                setCountdownNumber((num)=>num-1)
            },1000)
            return ()=> clearInterval(timerId)
        }
    },[countdownNumber])

    // 登录跳转
    const toLogin = ()=>{

    }

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
                <Button disabled={captchaDisable} loading={captchaBtnLoading} type="primary" onClick={sendCaptcha} >
                    {captchaDisable ? countdownNumber : ''} 获取验证码
                </Button>
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