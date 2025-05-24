// xavigate-frontend/src/components/RagChatView.tsx
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
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface RagChatViewProps {}

export default function RagChatView(props: RagChatViewProps) {
  const navigate = useNavigate();
  const { user, idToken } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();

  // --- MNTestResult profile load ---
  const [profile, setProfile] = useState<MnTestResult | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.uuid) return;
    (async () => {
      setProfileLoading(true);
      try {
        const prof = await fetchUserProfile(user.uuid, idToken as any);
        setProfile(prof);
      } catch (err) {
        console.warn('Failed to fetch MNTestResult, using defaults:', err);
        setProfile({ traitScores: {} });
      }
      setProfileLoading(false);
    })();
  }, [user?.uuid, idToken]);

  // --- Session & messages state ---
  const [uuid, setUUID] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [avatar, setAvatar] = useState('chappelle');
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  // generate or load persistent UUID
  useEffect(() => {
    setUUID(getOrCreateUserUUID());
  }, []);

  // scroll on new messages / typing changes
  useEffect(() => {
    if (messages.length > 0) {
      const behavior = isInitialLoad.current ? 'auto' : 'smooth';
      bottomRef.current?.scrollIntoView({ behavior });
      isInitialLoad.current = false;
    }
  }, [messages, isTyping]);

  // navigate helper
  const setActiveView = (view: string) => {
    navigate(`/${view}`);
  };

  // --- Memory fetch (unchanged) ---
  useEffect(() => {
    if (!uuid) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/storage/memory/get/${uuid}`, {
          headers: {
            Authorization: `Bearer ${idToken || 'foo'}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const text = await res.text();
          console.error(`Memory GET ${res.status}:`, text);
          return;
        }
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Memory not JSON:', text);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const converted: Message[] = data.map((item: any) => ({
            sender: item.role === 'user' ? 'user' : 'assistant',
            text: item.content,
            timestamp: getTimestamp(),
          }));
          setMessages(converted);
        } else if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('❌ Error fetching session memory:', err);
      }
    })();
  }, [uuid, idToken]);

  // --- Typing animation (unchanged) ---
  const [typingSpeed] = useState(8);
  const [typingChunkSize] = useState(2);
  const [typingVariability] = useState(true);

  useEffect(() => {
    const msg = messages.find(m => m.isTyping);
    if (!msg) return;

    const full = msg.fullText || '';
    const current = msg.text || '';
    if (current.length >= full.length) {
      setMessages(prev => prev.map(m => m.isTyping ? { ...m, isTyping: false } : m));
      return;
    }

    const chars = Math.min(typingChunkSize, full.length - current.length);
    const next = full.charAt(current.length);
    let delay = typingSpeed;
    if (typingVariability) {
      if ('.!?'.includes(next)) delay *= 4;
      else if (',;:'.includes(next)) delay *= 2;
      else if (next === ' ' && Math.random() < 0.1) delay *= 1.5;
    }

    const timer = setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.isTyping ? { ...m, text: full.slice(0, current.length + chars) } : m
      ));
    }, delay);

    return () => clearTimeout(timer);
  }, [messages, typingSpeed, typingChunkSize, typingVariability]);

  // --- sendMessage: fixed POST /api/chat/query ---
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const uid = user?.uuid;
    if (!uid) return console.error('No user UUID');
    if (!idToken) return console.error('No idToken');
    if (!profile) return console.error('Profile not loaded');

    // add user message
    setMessages(prev => [...prev, {
      sender: 'user',
      text: trimmed,
      timestamp: getTimestamp()
    }]);
    setInput('');
    setIsTyping(true);

    const payload = {
      userId: uid,
      username: user.email?.split('@')[0] || uid,
      fullName: user.email || uid,
      traitScores: profile.traitScores,
      sessionId: uid,
      message: trimmed,
    };

    try {
      const res = await fetch(`${BASE_URL}/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 500) {
        showToast('Oops, our chat service is down. Please try again soon.');
        return;
      }
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: res.statusText }));
        showToast(`Chat error: ${errJson.detail || res.statusText}`);
        return;
      }

      const { answer } = await res.json();
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: answer?.trim() || '', timestamp: getTimestamp() }
      ]);
    } catch (err: any) {
      console.error('Network/chat parse error:', err);
      showToast('Network error – please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setTimeout(() => document.querySelector('textarea')?.focus(), 100);
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return <WelcomeScreen onSuggestionClick={handleSuggestionClick} />;
    }
    return messages.map((m, i) =>
      <MessageItem key={i} message={m} isUser={m.sender === 'user'} />
    );
  };

  return (
    <>
      <AnimationStyles />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#FAFAFA',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        maxWidth: '900px',
        margin: '0 auto',
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FAFAFA',
        }}>
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
