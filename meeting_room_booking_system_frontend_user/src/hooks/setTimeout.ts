import { useEffect, useRef } from 'react';

type TimeoutFunction = () => void;

function useTimeout(callback: TimeoutFunction, delay: number | null): void {
  const savedCallback = useRef<TimeoutFunction | null>(null);

  // 保存最新的回调函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // 如果 delay 为 null，不设置定时器
    if (delay === null) {
      return;
    }

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setTimeout(tick, delay);

    // 清除定时器
    return () => clearTimeout(id);
  }, [delay]);
}

export default useTimeout;
