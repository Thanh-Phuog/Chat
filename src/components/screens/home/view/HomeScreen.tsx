'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Avatar, Typography, Space, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUser } from '@/context/UseContext';

const { Title } = Typography;

// Hàm tạo avatar ngẫu nhiên từ DiceBear (bottts style)
const getRandomAvatar = () =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substring(2, 10)}`;

const HomeScreen = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(getRandomAvatar());
  const { setUser } = useUser();
  const router = useRouter();

  const handleStartChat = () => {
    if (!name.trim()) {
      message.error('Vui lòng nhập tên người dùng!');
      return;
    }
    setUser({ username: name, avatar });
    router.push('/chat');
  };

  const regenerateAvatar = () => {
    setAvatar(getRandomAvatar());
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Space direction="vertical" align="center" size="large">
        <Title>Chào mừng đến với Chat App</Title>
        <Avatar size={100} src={avatar} icon={<UserOutlined />} />
        <Button onClick={regenerateAvatar}>Tạo avatar khác</Button>
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
