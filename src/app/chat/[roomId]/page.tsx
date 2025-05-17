import ChatScreen from "@/components/screens/chat/ChatScreen";

const ChatPage = ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params;

  return (
    <div>
      <ChatScreen roomId={roomId} />
    </div>
  );
};

export default ChatPage;