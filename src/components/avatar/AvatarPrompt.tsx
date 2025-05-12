import { useState } from 'react';

type AvatarPromptProps = {
  uuid: string;
  setAvatar: (name: string) => void;
  setAvatarPromptVisible: (visible: boolean) => void;
  backendUrl: string;
};

export default function AvatarPrompt({
  uuid,
  setAvatar,
  setAvatarPromptVisible,
  backendUrl,
}: AvatarPromptProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const chosen = inputValue.trim();
      setAvatar(chosen);
      setAvatarPromptVisible(false);

      await fetch(`${backendUrl}/persistent-memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid,
          preferences: { avatar: chosen },
        }),
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}
    >
      <p style={{ marginBottom: '0.5rem' }}>
        To personalize your experience, is there someone you'd like me to sound like?
      </p>
      <input
        type="text"
        placeholder="e.g., Gandhi, Oprah, your mentor..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleSubmit}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginBottom: '0.5rem',
        }}
      />
      <p style={{ fontSize: '0.75rem', color: '#888' }}>Press Enter to confirm</p>
    </div>
  );
}
