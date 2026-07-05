import { useState, useCallback } from 'react';
import { personas } from '@/data/personas';
import { sampleConversation, createMessage } from '@/data/conversations';
import { sendChatMessage } from '@/services/api';

export function useChat() {
  const [messages, setMessages] = useState(sampleConversation);
  const [activePersona, setActivePersona] = useState(personas[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (content) => {
    const userMessage = createMessage('user', content);
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsTyping(true);
    setError(null);

    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const data = await sendChatMessage(activePersona.id, apiMessages);
      const aiResponse = createMessage('assistant', data.reply);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  }, [activePersona, messages]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const switchPersona = useCallback((personaId) => {
    const persona = personas.find((p) => p.id === personaId);
    if (persona) {
      setActivePersona(persona);
      setMessages([]);
      setError(null);
    }
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    activePersona,
    isTyping,
    error,
    sendMessage,
    clearConversation,
    switchPersona,
    dismissError,
  };
}
