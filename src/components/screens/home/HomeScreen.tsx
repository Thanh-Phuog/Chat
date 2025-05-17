'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Typography, Space, message, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUser } from '@/context/auth/useAuth';
import { motion } from 'framer-motion';
import { defaultAuthenRepo } from '@/api/features/user/UserRepo';

const { Title } = Typography;

// Hàm tạo avatar ngẫu nhiên từ DiceBear (bottts style)
const getRandomAvatar = () =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substring(2, 10)}`;

const HomeScreen = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(getRandomAvatar());
  const { setUser } = useUser();
  const router = useRouter();

const handleStartChat = async () => {
  if (!name.trim()) {
    message.error('Vui lòng nhập tên người dùng!');
    return;
  }

  if (name.length < 3 || name.length > 20) {
    message.error('Tên người dùng phải từ 3 đến 20 ký tự!');
    return;
  }

  try {
    const response = await defaultAuthenRepo.login({ name: name });

    if (!response.error) {
      // Lưu thông tin user từ API
      setUser(
        {
          username: name,
          avatar: avatar,
        }
      ); 
      router.push('/selectroom');
    } else {
      message.error(response.message || 'Đăng nhập thất bại!');
    }
  } catch (error) {
    console.error('Login error:', error);
    message.error('Lỗi kết nối đến máy chủ!');
  }
};

  const regenerateAvatar = () => {
    setAvatar(getRandomAvatar());
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            padding: '24px',
          }}
        >
          <Space direction="vertical" align="center" size="large" style={{ width: '100%' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: 0 }}>
              Chào mừng đến với Chat App
            </Title>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Avatar size={120} src={avatar} icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </motion.div>
            <Button type="link" onClick={regenerateAvatar}>
              Tạo avatar khác
            </Button>
            <Input
              placeholder="Nhập tên của bạn (3-20 ký tự)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                borderRadius: 8,
                padding: '10px',
              }}
              size="large"
              maxLength={20} // Giới hạn tối đa 20 ký tự trong input
            />
            <Button
              type="primary"
              size="large"
              onClick={handleStartChat}
              style={{
                width: '100%',
                borderRadius: 8,
                height: 48,
                background: '#1890ff',
                border: 'none',
              }}
            >
              Bắt đầu chat
            </Button>
          </Space>
        </Card>
      </motion.div>
    </div>
  );
};

export default HomeScreen;