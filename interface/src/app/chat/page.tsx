'use client';

import { fixMarkDown } from '@/utils/fix-markdown';
import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Stream response from backend (SSE)
    let botMessage = '';
    setMessages((prev) => [...prev, { role: 'bot', content: '' }]);

    const eventSource = new EventSource(
      `http://192.168.0.111:3004/chat?prompt=${encodeURIComponent(
        `${input}. give the response in a markdown format`
      )}`
    );

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        setLoading(false);
        eventSource.close();
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, content: botMessage } : msg
          )
        );
      } else {
        botMessage += event.data;
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, content: botMessage } : msg
          )
        );
      }
    };

    eventSource.onerror = () => {
      setLoading(false);
      eventSource.close();
    };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xl ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {fixMarkDown(msg.content)}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {/** Loading animation */}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 max-w-xl bg-gray-200 text-gray-900 flex items-center gap-2">
              <span>Thinking</span>
              <span className="flex space-x-1">
                <span
                  className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full"
                  style={{ animationDelay: '0ms' }}
                ></span>
                <span
                  className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="flex items-center p-4 bg-white border-t border-gray-200"
      >
        <input
          type="text"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
