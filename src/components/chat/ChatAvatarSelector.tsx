import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, Check, Plus } from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'chappelle', name: 'Dave Chappelle', description: 'Satirical, sharp, truth-teller' },
  { id: 'dangerfield', name: 'Rodney Dangerfield', description: 'No respect, just real talk' },
  { id: 'gaga', name: 'Lady Gaga', description: 'Expressive, bold, and fabulous' },
];

export interface ChatAvatarSelectorProps {
  selectedId: string;
  setSelectedId: (id: string) => void;
  setActiveView: (view: string) => void; // ✅ required now
}

const ChatAvatarSelector: React.FC<ChatAvatarSelectorProps> = ({
  selectedId,
  setSelectedId,
  setActiveView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = AVATAR_OPTIONS.find((opt) => opt.id === selectedId) || AVATAR_OPTIONS[0];

  const handleCreateNewAvatar = () => {
    setIsOpen(false);
    setActiveView('avatar'); // ✅ navigate to Avatar Composer screen
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 24px 16px',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: '#9CA3AF',
          flex: 1,
          textAlign: 'center',
        }}
      >
        Press Enter to send, Shift+Enter for new line
      </div>

      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#111827',
            cursor: 'pointer',
          }}
        >
          {current.name}
          <ChevronUp
            size={14}
            color="#6B7280"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              right: 0,
              width: '260px',
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              padding: '6px 0',
              zIndex: 20,
            }}
          >
            {/* Create a New Avatar */}
            <div
              onClick={handleCreateNewAvatar}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #E5E7EB',
                marginBottom: '4px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#8B5CF6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                }}
              >
                <Plus size={16} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                  Create a New Avatar
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  Customize a personality for your chat
                </div>
              </div>
            </div>

            {/* Avatar List */}
            {AVATAR_OPTIONS.map((opt) => {
              const selected = opt.id === selectedId;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedId(opt.id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: selected ? '#F3F4F6' : 'transparent',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                  onMouseOut={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#8B5CF6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                      {opt.name.charAt(0)}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                      {opt.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{opt.description}</div>
                  </div>
                  {selected && <Check size={16} color="#8B5CF6" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAvatarSelector;
