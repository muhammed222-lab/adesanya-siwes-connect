
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: Date;
  senderName: string;
}

interface ChatInterfaceProps {
  recipientName: string;
  recipientId: string;
  currentUserId: string;
  currentUserName: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  recipientName,
  recipientId,
  currentUserId,
  currentUserName,
}) => {
  const [message, setMessage] = useState('');
  
  // Mock messages for demonstration purposes
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: currentUserId,
      message: 'Hello, how are you doing?',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      senderName: currentUserName,
    },
    {
      id: '2',
      senderId: recipientId,
      message: "I'm doing well, thank you! How can I help you today?",
      timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
      senderName: recipientName,
    },
    {
      id: '3',
      senderId: currentUserId,
      message: "I wanted to discuss my latest weekly report submission.",
      timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
      senderName: currentUserName,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      message: message,
      timestamp: new Date(),
      senderName: currentUserName,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="bg-aapoly-purple text-white p-4 rounded-t-lg">
        <h3 className="font-semibold">Chat with {recipientName}</h3>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.senderId === currentUserId 
                  ? 'bg-aapoly-purple text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{msg.message}</p>
              <p className={`text-xs mt-1 ${
                msg.senderId === currentUserId ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your message..."
        />
        <button 
          type="submit"
          className="bg-aapoly-purple text-white px-4 py-2 rounded-r-lg flex items-center justify-center"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
