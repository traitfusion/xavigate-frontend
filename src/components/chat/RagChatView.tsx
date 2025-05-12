import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import MessageItem from './MessageItem';
import ThinkingIndicator from './ThinkingIndicator';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import AnimationStyles from './AnimationStyles';

import { Message } from './types';
import { getTimestamp, getOrCreateUserUUID } from './utils';

export interface RagChatViewProps {}

export default function RagChatView(props: RagChatViewProps) {
  const { idToken } = useAuth();
  const navigate = useNavigate();

  const [uuid, setUUID] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [avatar, setAvatar] = useState('chappelle');

  const setActiveView = (view: string) => {
    console.log('Navigating to view:', view);
    navigate(`/${view}`);
  };

  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const [typingSpeed] = useState(8);
  const [typingChunkSize] = useState(2);
  const [typingVariability] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8010';

  useEffect(() => {
    setUUID(getOrCreateUserUUID());
  }, []);

  useEffect(() => {
    if (!uuid) return;
    fetch(`${BACKEND_URL}/session-memory/${uuid}`, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.messages?.length) setMessages(data.messages);
      });
  }, [uuid, idToken, BACKEND_URL]);

  useEffect(() => {
    if (messages.length > 0) {
      const scrollBehavior = isInitialLoad.current ? 'auto' : 'smooth';
      bottomRef.current?.scrollIntoView({ behavior: scrollBehavior });
      isInitialLoad.current = false;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const typingMessage = messages.find((m) => m.isTyping);
    if (!typingMessage) return;

    const fullText = typingMessage.fullText || '';
    const currentText = typingMessage.text || '';

    if (currentText.length >= fullText.length) {
      setMessages((prev) => prev.map((m) => (m.isTyping ? { ...m, isTyping: false } : m)));
      return;
    }

    const charsToAdd = Math.min(typingChunkSize, fullText.length - currentText.length);
    const newText = fullText.substring(0, currentText.length + charsToAdd);
    const nextChar = fullText[currentText.length];
    let adjustedSpeed = typingSpeed;

    if (typingVariability && nextChar) {
      if ('.!?'.includes(nextChar)) adjustedSpeed *= 4;
      else if (',;:'.includes(nextChar)) adjustedSpeed *= 2;
      else if (nextChar === ' ' && Math.random() < 0.1) adjustedSpeed *= 1.5;
    }

    const timer = setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.isTyping ? { ...m, text: newText } : m)));
    }, adjustedSpeed);

    return () => clearTimeout(timer);
  }, [messages, typingSpeed, typingChunkSize, typingVariability]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      sender: 'user',
      text: trimmed,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ prompt: trimmed, uuid, avatar, tone: avatar }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        sender: 'assistant',
        text: '',
        fullText: data.answer,
        isTyping: true,
        sources: data.sources || [],
        followup: data.followup || null,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      await fetch(`${BACKEND_URL}/session-memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          uuid,
          conversation_log: {
            messages: [
              ...messages,
              userMessage,
              { ...assistantMessage, text: assistantMessage.fullText, isTyping: false },
            ],
          },
          interim_scores: {},
        }),
      });
    } catch (err) {
      console.error('Error fetching response:', err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, I encountered an error. Please try again.',
          timestamp: getTimestamp(),
        },
      ]);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      document.querySelector('textarea')?.focus();
    }, 100);
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return <WelcomeScreen onSuggestionClick={handleSuggestionClick} />;
    }

    return messages.map((message, index) => (
      <MessageItem key={index} message={message} isUser={message.sender === 'user'} />
    ));
  };

  return (
    <>
      <AnimationStyles />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: '#FAFAFA',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
          maxWidth: '900px',
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FAFAFA',
            justifyContent: messages.length > 0 ? 'flex-start' : 'flex-end',
          }}
        >
          {renderMessages()}
          {isTyping && <ThinkingIndicator />}
          <div ref={bottomRef} />
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          avatar={avatar}
          setAvatar={setAvatar}
          setActiveView={setActiveView}
        />
      </div>
    </>
  );
}
