import { useState, useCallback } from 'react';
import { ChatMessage, BIResponse } from '../../src/types/index.js';
import { sendChatQuery } from '../services/api.js';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await sendChatQuery(userText.trim());

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        biResponse: response.data,
        isClarification: response.data.clarificationNeeded,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg = err?.response?.data?.error || err?.message || 'Failed to analyze Monday.com data.';
      setError(errMsg);

      const botErrMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: `Sorry, an error occurred while analyzing Monday.com data: ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botErrMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearHistory,
  };
}
