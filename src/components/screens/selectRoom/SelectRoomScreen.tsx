'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Space, message, Card, List, Avatar, Button } from 'antd';
import { motion } from 'framer-motion';
import { useUser } from '@/context/auth/useAuth';

const { Title, Text } = Typography;

// Giả lập danh sách phòng từ backend (thay bằng API thực tế nếu có)
const fetchRooms = async () => {
  // Thay bằng gọi API: await fetch('/api/rooms')
  return [
    { id: 'room1', name: 'Phòng 1' },
    { id: 'room2', name: 'Phòng 2' },
    { id: 'room3', name: 'Phòng 3' },
  ];
};

const SelectRoomScreen = () => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user } = useUser();
  const router = useRouter();

  // Kiểm tra user và lấy danh sách phòng
  useEffect(() => {
    if (!user) {
      router.push('/home');
      return;
    }

    // Lấy danh sách phòng từ backend
    fetchRooms()
      .then((data) => setRooms(data))
      .catch(() => {
        message.error('Không thể tải danh sách phòng!');
      });
  }, [user, router]);

  const handleJoinRoom = (id: string) => {
    router.push(`/chat/${id}`);
  };

  if (!user) return null;

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
              Chọn phòng chat
            </Title>
            <Avatar size={60} src={user.avatar} />
            <Text strong>Xin chào, {user.username}</Text>
            <Title level={4} style={{ marginTop: 16 }}>
              Danh sách phòng
            </Title>
            <List
              dataSource={rooms}
              renderItem={(room) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginBottom: 8 }}
                >
                  <List.Item>
                    <Button
                      type="default"
                      style={{ width: '100%', borderRadius: 8, height: 40 }}
                      onClick={() => handleJoinRoom(room.id)}
                    >
                      {room.name} (ID: {room.id})
                    </Button>
                  </List.Item>
                </motion.div>
              )}
            />
          </Space>
        </Card>
      </motion.div>
    </div>
  );
};

export default SelectRoomScreen;