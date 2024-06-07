import React, { useState } from 'react';
import useTimeout from '../../hooks/setTimeout';

const UpdatePassword: React.FC = () => {
  const [count, setCount] = useState(0);

  // 使用自定义 Hook，每秒递增计数器
  useTimeout(() => {
    setCount((prevCount) => prevCount + 1);
  }, 1000);

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
};

export {UpdatePassword};
