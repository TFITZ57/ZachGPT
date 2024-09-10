'use client';

import React, { forwardRef, useState } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isStreaming: boolean;
  placeholder: string;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ onSubmit, isStreaming, placeholder }, ref: React.Ref<HTMLTextAreaElement>) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim() && !isStreaming) {
        onSubmit(message);
        setMessage('');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div className="relative">
          <textarea
            ref={ref}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#3A3A3A] text-white placeholder-gray-400 rounded-lg px-4 py-2 pr-12 resize-none"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '200px' }}
          />
          <button
            type="submit"
            disabled={isStreaming || !message.trim()}
            className="absolute right-2 bottom-2 bg-blue-500 text-white rounded-md px-4 py-1 text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    );
  }
);

ChatInput.displayName = 'ChatInput';