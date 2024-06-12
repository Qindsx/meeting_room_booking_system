import { Button, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"

interface CaptchaButtonType {
    countdownDuration:number;
    requestCallback:()=>Promise<any>
}

const CaptchaButton:React.FC<CaptchaButtonType> = ({ countdownDuration = 60, requestCallback}) => {
    // 发送成功后 需要禁用发送按钮60秒
    const [captchaDisable, setCaptchaDisable] = useState(false)
    // loading
    const [captchaBtnLoading, setCaptchaBtnLoading] = useState<boolean>(false)
    // 倒计时
    const [countdownNumber, setCountdownNumber] = useState(0)


    // 邮箱发送
    const sendCaptcha = useCallback(async () => {
        setCaptchaBtnLoading(true)
        try {
            const { data, status } = await requestCallback()
            if (status == 200 || status == 201) {
                message.success(data.data)
                setCaptchaBtnLoading(false)
                setCaptchaDisable(true)
                setCountdownNumber(countdownDuration)
            } else {
                setCaptchaBtnLoading(false)
                message.error(data.data || '系统繁忙，请稍后再试');
            }
        } catch (error) {
            setCaptchaBtnLoading(false)
            message.error('网络错误，请重试')
        }
    }, [countdownDuration])

    // 验证码60秒倒计时
    useEffect(() => {
        if (countdownNumber <= 0) {
            setCaptchaDisable(false);
            return
        }
        if (captchaDisable) {
            const timerId = setInterval(() => {
                setCountdownNumber((num) => num - 1)
            }, 1000)
            return () => clearInterval(timerId)
        }
    }, [captchaDisable, countdownNumber])

    return <div>
        <Button disabled={captchaDisable} loading={captchaBtnLoading} type="primary" onClick={sendCaptcha} >
            {captchaDisable ? countdownNumber : ''} 获取验证码
        </Button>
    </div>
}

export default CaptchaButton