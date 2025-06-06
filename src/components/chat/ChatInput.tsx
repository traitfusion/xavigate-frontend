import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
// import ChatAvatarSelector from './ChatAvatarSelector';
import { Textarea, Button } from '@/design-system/components';
import { useTranslation } from 'react-i18next';

export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  avatar: string;
  setAvatar: (id: string) => void;
  setActiveView: (view: string) => void; // 🧂 added for Avatar Composer trigger
  /** Disable input and send while processing */
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  sendMessage,
  avatar,
  setAvatar,
  setActiveView,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const scrollPos = window.scrollY;
    textarea.style.height = '20px';
    textarea.style.height = `${Math.min(Math.max(40, textarea.scrollHeight), 150)}px`;
    window.scrollTo(0, scrollPos);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(e as any);
    }
  };

  return (
    <div style={{ borderTop: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
      <div style={{ padding: '16px 24px' }}>
        <form
          onSubmit={sendMessage}
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #C4B5FD',
            borderRadius: '8px',
            padding: '8px 16px',
            backgroundColor: '#fff',
            overflow: 'hidden',
          }}
        >
          <Textarea
            ref={textareaRef as any}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.placeholder')}
            disabled={disabled}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              backgroundColor: 'transparent',
              minHeight: '40px',
            }}
          />
          <Button
            type="submit"
            variant="ghost"
            disabled={disabled || !input.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              border: 'none',
              cursor: disabled || input.trim() === '' ? 'default' : 'pointer',
            }}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>

      { /* Avatar selector dropdown - commented out per request
      <ChatAvatarSelector
        selectedId={avatar}
        setSelectedId={setAvatar}
        setActiveView={setActiveView}
      />
      */ }
    </div>
  );
};

export default ChatInput;
