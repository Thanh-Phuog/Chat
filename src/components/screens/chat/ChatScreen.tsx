'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input, Button, Typography, Space, message, Card, List, Avatar, Badge } from 'antd';
import { motion } from 'framer-motion';
import { useUser } from '@/context/auth/useAuth';
import io, { Socket } from 'socket.io-client';

const { Title, Text } = Typography;

let socket: Socket;

const ChatScreen = () => {
  const [messages, setMessages] = useState<
    { user: { username: string; avatar: string }; message: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userCount, setUserCount] = useState(0);
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) {
      router.push('/home');
      return;
    }

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      withCredentials: true,
    });

    if (roomId) {
      socket.emit('join-room', { roomId, user });
    }

    socket.on('user-joined', (joinedUser) => {
      setMessages((prev) => [
        ...prev,
        { user: joinedUser, message: `${joinedUser.username} đã tham gia phòng` },
      ]);
    });

    socket.on('receive-message', ({ message, user }) => {
      setMessages((prev) => [...prev, { user, message }]);
    });

    socket.on('room-data', ({ userCount }) => {
      setUserCount(userCount);
    });

    return () => {
      socket.off('user-joined');
      socket.off('receive-message');
      socket.off('room-data');
      socket.disconnect();
    };
  }, [user, roomId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) {
      message.error('Vui lòng nhập tin nhắn!');
      return;
    }

    if (!user || !roomId) return;

    socket.emit('send-message', { roomId, message: inputMessage, user });
    setMessages((prev) => [...prev, { user, message: inputMessage }]);
    setInputMessage('');
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
            maxWidth: 600,
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '24px',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: 0, textAlign: 'center' }}>
              Phòng chat: {roomId}
            </Title>
            <Space style={{ justifyContent: 'center', width: '100%' }}>
              <Badge count={userCount} style={{ backgroundColor: '#52c41a' }}>
                <Avatar size={60} src={user.avatar} />
              </Badge>
              <Text strong>{user.username}</Text>
            </Space>
            <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
              {userCount} người đang trong phòng
            </Text>
            <div
              style={{
                maxHeight: '50vh',
                overflowY: 'auto',
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                padding: '16px',
                background: '#fff',
              }}
            >
              <List
                dataSource={messages}
                renderItem={(msg, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta
                      avatar={<Avatar src={msg.user.avatar} />}
                      title={msg.user.username}
                      description={msg.message}
                    />
                  </List.Item>
                )}
              />
              <div ref={messagesEndRef} />
            </div>
            <Space style={{ width: '100%' }}>
              <Input
                placeholder="Nhập tin nhắn"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onPressEnter={handleSendMessage}
                style={{ flex: 1, borderRadius: 8, padding: '10px' }}
                size="large"
              />
              <Button
                type="primary"
                size="large"
                onClick={handleSendMessage}
                style={{ borderRadius: 8, height: 48, background: '#1890ff', border: 'none' }}
              >
                Gửi
              </Button>
            </Space>
          </Space>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChatScreen;