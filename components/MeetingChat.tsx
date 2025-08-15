'use client';

import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
}

const MeetingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useUser();
  const call = useCall();

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: `${Date.now()}-${user.id}`,
      user: user.fullName || user.username || 'Anonymous',
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Integrate with Stream's chat when available
    // For now, this is local to each user
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] relative"
        title="Open chat"
      >
        <MessageCircle size={20} className="text-white" />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {messages.length > 9 ? '9+' : messages.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-20 w-80 h-96 bg-dark-1 border border-gray-600 rounded-lg flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <h3 className="text-white font-semibold">Meeting Chat</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-blue-400">{msg.user}</span>
                <span className="text-gray-500 text-xs">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-white bg-dark-3 rounded-lg px-3 py-2">
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-600 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-dark-3 border-gray-600 text-white"
        />
        <Button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          size="sm"
          className="bg-blue-1 hover:bg-blue-600"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

export default MeetingChat;
