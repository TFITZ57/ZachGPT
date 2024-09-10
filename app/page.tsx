'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Plus, Trash2, ChevronDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { ChatInput } from './components/ChatInput';
import { streamMessage } from './actions/stream-message';

interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useState('');
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const [highness, setHighness] = useState('Slightly Stoned');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (currentChatId && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [currentChatId]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      name: `New Chat ${chats.length + 1}`,
      messages: []
    };
    setChats((prevChats: Chat[]) => [...prevChats, newChat]);
    return newChat;
  };

  const updateChatMessages = (chatId: string, newMessages: ChatMessage[]) => {
    setChats((prevChats: Chat[]) =>
      prevChats.map((chat: Chat) =>
        chat.id === chatId ? { ...chat, messages: newMessages } : chat
      )
    );
  };

  const handleMessageSubmit = async (userMessage: string) => {
    if (isStreaming) return;

    // Create a new chat if there are no existing chats
    if (chats.length === 0 || !currentChatId) {
      const newChat = createNewChat();
      setCurrentChatId(newChat.id);
    }

    setIsStreaming(true);
    setStreamingMessage('');

    const newUserMessage: ChatMessage = { id: Date.now(), role: 'user', content: userMessage };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    updateChatMessages(currentChatId!, updatedHistory);

    try {
      console.log('Sending message to AI:', userMessage);
      const response = await streamMessage(JSON.stringify(updatedHistory));
      console.log('Received response from AI:', response);

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        console.log('Received chunk:', chunk);
        fullResponse += chunk;
        setStreamingMessage((prev: string) => prev + chunk);
      }

      console.log('Full response:', fullResponse);

      if (fullResponse) {
        const newAssistantMessage: ChatMessage = { id: Date.now(), role: 'assistant', content: fullResponse };
        const finalHistory = [...updatedHistory, newAssistantMessage];
        setChatHistory(finalHistory);
        updateChatMessages(currentChatId!, finalHistory);
      } else {
        console.warn('No response received from AI');
        throw new Error('No response received from AI');
      }
    } catch (error) {
      console.error('Error in handleMessageSubmit:', error);
      const errorMessage: ChatMessage = { 
        id: Date.now(), 
        role: 'assistant', 
        content: `Error: ${(error as Error).message || 'Unknown error occurred'}` 
      };
      const finalHistory = [...updatedHistory, errorMessage];
      setChatHistory(finalHistory);
      updateChatMessages(currentChatId!, finalHistory);
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
    }
  };

  const deleteChat = (chatId: string) => {
    setChats((prevChats: Chat[]) => prevChats.filter((chat: Chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setChatHistory([]);
    }
  };

  const filteredChats = chats.filter((chat: Chat) => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#1E1E1E] min-h-screen flex flex-col">
      {/* Banner */}
      <div className="bg-[#2A2A2A] p-2 flex justify-between items-center">
        <div className={`flex items-center ${sidebarOpen ? 'ml-[300px]' : 'ml-4'} transition-all duration-300`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none mr-4"
          >
            <Menu size={24} />
          </button>
          <div className="text-white font-bold text-xl">ZachGPT</div>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white focus:outline-none flex items-center"
          >
            Latency: {highness} <ChevronDown size={20} className="ml-2" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#3A3A3A] rounded-md shadow-lg z-10">
              {['Slightly Stoned', 'Moderately High', 'Pretty Baked', 'Time To Go Lie Down'].map((option) => (
                <button
                  key={option}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4A4A4A]"
                  onClick={() => {
                    setHighness(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`w-[300px] bg-[#2A2A2A] p-4 fixed h-full transition-all duration-300 ${sidebarOpen ? 'left-0' : '-left-[300px]'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-2xl font-semibold">Chats</h2>
            <button
              onClick={createNewChat}
              className="text-white focus:outline-none hover:text-gray-300 transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#3A3A3A] text-white placeholder-gray-400 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* List of chats */}
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 mb-2 rounded cursor-pointer flex justify-between items-center ${
                  chat.id === currentChatId ? 'bg-[#3A3A3A]' : 'hover:bg-[#3A3A3A]'
                }`}
              >
                <span onClick={() => {
                  setCurrentChatId(chat.id);
                  setChatHistory(chat.messages);
                }}>
                  {chat.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="text-gray-400 hover:text-white focus:outline-none"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-[300px]' : ''} transition-all duration-300`}>
          {/* Sidebar toggle button and label */}
          {/* <div className="absolute top-4 left-4 flex flex-col items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white focus:outline-none mb-1"
            >
              <Menu size={24} />
            </button>
            <span className="text-white text-xs"> </span>
          </div> */}

          <div className="flex-1 overflow-y-auto p-4">
            {chatHistory.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-4 flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center mr-2">
                    <Image src="/favicon.ico" alt="AI" width={20} height={20} />
                  </div>
                )}
                <div
                  className={`inline-block max-w-[70%] ${
                    msg.role === 'user' 
                      ? 'bg-[#2A2A2A] text-white rounded-2xl' 
                      : 'bg-[#2A2A2A] text-white rounded-2xl'
                  } px-4 py-2`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center mr-2">
                  <Image src="/favicon.ico" alt="AI" width={32} height={32} />
                </div>
                <div className="inline-block max-w-[70%] bg-[#2A2A2A] text-white rounded-2xl px-4 py-2">
                  {streamingMessage}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 flex justify-center">
            <ChatInput 
              onSubmit={handleMessageSubmit} 
              isStreaming={isStreaming} 
              ref={chatInputRef}
              placeholder="Message ZachGPT"
            />
          </div>
        </div>
      </div>
    </div>
  );
}