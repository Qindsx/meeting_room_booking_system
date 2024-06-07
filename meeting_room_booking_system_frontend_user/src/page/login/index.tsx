import { Button, DatePicker, Form, Input, message } from "antd";
import './login.css'
import { login } from "../../api/user";
import { Link } from "react-router-dom";

interface LoginUser {
    username: string
    password: string
}

const onFinish = async (values: LoginUser) => {
    try {
        const { username, password } = values;
        const res = await login(username, password);

        const { status, data } = res;

        if (status === 200 || status === 201) {
            message.success('登录成功');
            console.log(data)
            localStorage.setItem('access_token', data.data.accessToken);
            localStorage.setItem('refresh_token', data.data.refreshToken);
            localStorage.setItem('user_info', JSON.stringify(data.data.userInfo));
        } else {
            message.error(data.data || '系统繁忙，请稍后再试');
        }
    } catch (error) {
        message.error('请求失败，请检查网络连接或稍后重试');
    }
}

const layout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
}

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
}

export function Login() {

    return <div id="login-container">
        <h1>会议室预订系统</h1>
        <Form
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
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
            >
                <Input.Password></Input.Password>
            </Form.Item>
            <Form.Item
                {...layout2}
            >
                <div className='links'>
                    <Link to="/register">创建账号</Link>
                    <Link to="/update_password">忘记密码</Link>
                </div>
            </Form.Item>
            <Form.Item
                {...layout2}
            >
                <Button className='btn' type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>
        </Form>
    </div>
}
