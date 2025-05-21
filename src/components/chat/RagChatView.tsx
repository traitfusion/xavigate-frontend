import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import MessageItem from './MessageItem';
import ThinkingIndicator from './ThinkingIndicator';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import AnimationStyles from './AnimationStyles';
import { Message } from './types';
import { getTimestamp, getOrCreateUserUUID } from './utils';
import { fetchUserProfile, MnTestResult } from '@/api/fetchUserProfile';
import { useToast } from '@/components/toaster/useToast';

// Base URL for chat service API (uses relative path to leverage proxy)
const BASE_URL = '/api';

// Remove unused interface to fix the warning
export interface RagChatViewProps {}

export default function RagChatView(props: RagChatViewProps) {
  const navigate = useNavigate();
  const { user, idToken } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  // User profile (MN Test result) data
  const [profile, setProfile] = useState<MnTestResult | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  // Load user profile to check if MN test has been taken
  useEffect(() => {
    if (!user?.uuid) return;
    (async () => {
      setProfileLoading(true);
      try {
        const prof = await fetchUserProfile(user.uuid, idToken as any);
        setProfile(prof);
      } catch (err) {
        // On error, fall back to empty traitScores
        console.warn('Failed to fetch MNTestResult, using defaults:', err);
        setProfile({ traitScores: {} });
      }
      setProfileLoading(false);
    })();
  }, [user?.uuid, idToken]);


  const [uuid, setUUID] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Keep avatar state for ChatInput component compatibility
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

  useEffect(() => {
    setUUID(getOrCreateUserUUID());
  }, []);

  useEffect(() => {
    if (!uuid) return;
    (async () => {
      try {
        console.log(`Fetching memory from ${BASE_URL}/storage/memory/get/${uuid}`);
        // Fetch memory from storage service according to docs
        const res = await fetch(`${BASE_URL}/storage/memory/get/${uuid}`, {
          headers: { 
            Authorization: `Bearer ${idToken || 'foo'}`, // Use idToken if available, otherwise use the development token
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Server responded with ${res.status}:`, errorText);
          return;
        }
        
        const contentType = res.headers.get('content-type');
        console.log('Memory response content type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await res.text();
          console.error('Memory response is not JSON:', textResponse);
          return;
        }
        
        const data = await res.json();
        console.log('Received memory data:', data);
        
        // Handle different potential response formats
        if (Array.isArray(data)) {
          // Format from docs: array of {role, content} objects
          if (data.length > 0 && data[0].role && data[0].content) {
            try {
              // Make sure we create valid Message objects that match our type
              const convertedMessages: Message[] = data.map(item => ({
                sender: item.role === 'user' ? 'user' : 'assistant',
                text: item.content,
                timestamp: getTimestamp(),
              }));
              console.log('Converted messages:', convertedMessages);
              setMessages(convertedMessages);
            } catch (convErr) {
              console.error('Error converting messages:', convErr);
            }
          }
        } else if (typeof data === 'object' && data !== null) {
          // Alternative format: {messages: [...]}
          if (data.messages && Array.isArray(data.messages)) {
            try {
              console.log('Using messages from response:', data.messages);
              setMessages(data.messages);
            } catch (msgErr) {
              console.error('Error setting messages from response:', msgErr);
            }
          }
        }
      } catch (err) {
        console.error('❌ Error fetching session memory:', err);
      }
    })();
  }, [uuid, idToken]);

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
    // Ensure we have an authenticated user before sending
    const uid = user?.uuid;
    if (!uid) {
      console.error('No authenticated user; cannot send chat message');
      return;
    }
    // Grab username/email for ChatRequest
    const email = user.email;
    // Ensure we have a valid auth token before calling Chat API
    if (!idToken) {
      console.error('No idToken—cannot call Chat API');
      return;
    }
    console.log('Using idToken:', idToken);
    if (!profile) {
      console.error('Profile not loaded');
      return;
    }
    // Append user message to chat
    const userMessage: Message = {
      sender: 'user',
      text: trimmed,
      timestamp: getTimestamp(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    try {
      // Prepare single-message ChatRequest payload per swagger
      const payload = {
        userId: uid,
        // AuthContext user.email exists; derive username from it:
        username: user.email?.split('@')[0] || uid,
        fullName: user.email || uid,
        // Pass traitScores separately if needed:
        traitScores: profile?.traitScores,
        sessionId: uid,
        message: trimmed,
      };
      console.log('Chat payload:', payload);
      // Network call with its own error handling
      let res: Response;
      try {
        res = await fetch(`${BASE_URL}/chat/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(payload),
        });
      } catch (networkErr) {
        console.error('Network error calling chat:', networkErr);
        showToast('Chat service unreachable. Try again later.');
        return;
      }
      // Handle HTTP errors
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: res.statusText }));
        console.error('Chat API error', errJson);
        showToast(
          errJson.detail === 'Failed to fetch glossary chunks'
            ? 'Sorry—our trait glossary is temporarily unavailable.'
            : `Chat service error: ${errJson.detail || res.status}`
        );
        return;
      }
      // Parse and render assistant answer
      const { answer } = await res.json();
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: answer?.trim() || '', timestamp: getTimestamp() }
      ]);
    } catch (err: any) {
      console.error('Chat API error', err);
      showToast('An unexpected error occurred. Please try again.');
      return;
    } finally {
      setIsTyping(false);
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
          padding: '0 24px 24px', // remove top padding, keep sides and bottom
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
          disabled={isTyping}
        />
      </div>
    </>
  );
}