import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import { Button, Input, FormGroup, Text, Form } from '@/design-system/components';

export default function NewUser() {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });

    signIn();
    navigate('/');
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '1.5rem',
      }}
    >
      <Text variant="h2" style={{ textAlign: 'center' }}>
        Create a New User
      </Text>

      <Form onSubmit={handleCreate}>
        <FormGroup label="Your name" htmlFor="new-username">
          <Input
            id="new-username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            required
          />
        </FormGroup>

        <Button type="submit" style={{ width: '100%' }}>
          Create Account
        </Button>
      </Form>

      <Text variant="caption" style={{ textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to="/" style={{ color: '#4338ca' }}>
          Sign in
        </Link>
      </Text>
    </div>
  );
}
