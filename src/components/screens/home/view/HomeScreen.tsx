'use client';
import { useState } from 'react';
import { Input, Button, Typography, Space, message } from 'antd';
import { useUser } from '@/context/auth/useAuth';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const HomeScreen = () => {
  const [name, setName] = useState('');
  const { setUser } = useUser();
  const router = useRouter();

  const handleStartChat = () => {
    if (!name.trim()) {
      message.error('Vui lòng nhập tên người dùng!');
      return;
    }

    // Không cần avatar URL nữa, chỉ lưu tên
    setUser({ username: name });
    router.push('/chat');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Space direction="vertical" align="center" size="large">
        <Title>Chào mừng đến với Chat App</Title>
        <Input
          placeholder="Nhập tên của bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: 250 }}
        />
        <Button type="primary" onClick={handleStartChat}>
          Bắt đầu chat
        </Button>
      </Space>
    </div>
  );
};

export default HomeScreen;
