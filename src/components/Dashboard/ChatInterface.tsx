import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (message: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentUserId,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow">
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
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-aapoly-purple"
          placeholder="Type your message..."
        />
        <button 
          type="submit"
          className="bg-aapoly-purple text-white px-4 py-2 rounded-r-lg flex items-center justify-center hover:bg-aapoly-purple/90"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
