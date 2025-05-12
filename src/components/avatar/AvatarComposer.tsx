import { useState } from 'react';
import { useToast } from '../toaster/useToast';
import { useAuth } from '../../context/AuthContext';
import Textarea from '@/design-system/components/Textarea';

type AvatarComposerProps = {
  uuid: string;
  backendUrl: string;
  onSave?: (profile: { avatar_id: string; prompt_framing: string }) => void;
};

export default function AvatarComposer({ uuid, backendUrl, onSave }: AvatarComposerProps) {
  const [selectedTone, setSelectedTone] = useState('Wise Mentor');
  const { setUser, user } = useAuth();
  const [customDescription, setCustomDescription] = useState('');
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const generatePreview = () => {
    return `This avatar speaks in the tone of a ${selectedTone.toLowerCase()}${
      customDescription ? ` — ${customDescription}` : ''
    }. It reflects your desired guidance style.`;
  };

  const handleSave = async () => {
    const profile = {
      avatar_id: selectedTone,
      prompt_framing: customDescription,
    };

    const payload = {
      uuid,
      preferences: {
        avatar_profile: profile,
      },
    };

    try {
      await fetch(`${backendUrl}/persistent-memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (user) {
        setUser({ ...user, avatarProfile: profile });
      }

      onSave?.(profile);

      showToast('✅ Avatar saved!');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving avatar profile:', err);
      showToast('⚠️ Failed to save avatar');
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '640px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '2rem',
          color: '#111827',
        }}
      >
        Avatar Composer
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151',
            }}
          >
            Select a tone
          </label>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              backgroundColor: 'white',
              boxSizing: 'border-box',
            }}
          >
            <option>Wise Mentor</option>
            <option>Playful Friend</option>
            <option>Stoic Guide</option>
            <option>Poetic Philosopher</option>
            <option>Soul Sister</option>
            <option>Consigliere</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151',
            }}
          >
            Describe your avatar’s voice
          </label>
          <Textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="e.g., gentle and thoughtful, with a touch of humor"
            rows={8}
          />
        </div>

        <div
          style={{
            marginTop: '0.5rem',
            backgroundColor: '#F3F4F6',
            color: '#4B5563',
            padding: '12px 16px',
            borderRadius: '6px',
            border: '1px solid #E5E7EB',
            fontSize: '13px',
            fontStyle: 'italic',
            fontFamily: '"Georgia", serif',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            boxSizing: 'border-box',
          }}
        >
          {generatePreview()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#4F46E5',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
          >
            Save Avatar
          </button>
        </div>

        {saved && (
          <div style={{ fontSize: '14px', color: '#10B981', marginTop: '0.5rem' }}>✅ Saved</div>
        )}
      </div>
    </div>
  );
}
