'use client';

import React, { forwardRef, useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isStreaming: boolean;
  placeholder?: string;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ onSubmit, isStreaming, placeholder = 'Type a message...' }, ref) => {
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
      if (message.trim() && !isStreaming) {
        onSubmit(message);
        setMessage('');
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <div className="flex items-center w-full max-w-3xl">
        <textarea
          ref={ref}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-grow bg-[#2A2A2A] text-white rounded-l-md px-4 py-2 focus:outline-none resize-none"
          rows={1}
        />
        <button
          onClick={handleSubmit}
          disabled={isStreaming || !message.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';