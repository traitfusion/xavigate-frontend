import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Auth from '@aws-amplify/auth';
import { Link } from 'react-router-dom';
import { Card, Form, FormGroup, Input, Button, Text } from '@/design-system/components';
import { LanguageSelector } from '@/components/language';
import logo from '../../assets/Xavigate_Logo.svg';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // 1) Clear any stale authenticated session
      try {
        await Auth.currentAuthenticatedUser();
        await Auth.signOut();
      } catch {
        // no existing user session to clear
      }
      // 2) Attempt sign-in (retry on already authenticated)
      try {
        await Auth.signIn({ username: email, password });
      } catch (signInErr: any) {
        if (signInErr.name === 'UserAlreadyAuthenticatedException' ||
            signInErr.code === 'UserAlreadyAuthenticatedException') {
          // Clear stale session and retry once
          await Auth.signOut();
          await Auth.signIn({ username: email, password });
        } else {
          throw signInErr;
        }
      }
      // Retrieve current session tokens
      const session: any = await Auth.fetchAuthSession();
      const tokens = session.tokens || {};
      const idToken = tokens.idToken?.toString() ?? '';
      const accessToken = tokens.accessToken?.toString() ?? '';
      // Store tokens and set initial view to Chat
      localStorage.setItem('id_token', idToken);
      localStorage.setItem('access_token', accessToken);
      // Ensure returning users start in Chat view
      localStorage.setItem('activeView', 'chat');
      window.location.href = '/';
    } catch (err: any) {
      console.error('Login error', err);
      // Friendly error messages for authentication failures
      if (err.code === 'UserNotFoundException' || err.name === 'UserNotFoundException') {
        setError(t('login.errors.userNotFound'));
      } else if (err.code === 'NotAuthorizedException' || err.name === 'NotAuthorizedException') {
        setError(t('login.errors.incorrectCredentials'));
      } else if (err.code === 'UserNotConfirmedException' || err.name === 'UserNotConfirmedException') {
        setError(t('login.errors.notConfirmed'));
      } else {
        setError(err.message || t('login.errors.loginFailed'));
      }
    }
  };

  return (
    <Card padding="md" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img src={logo} alt="Xavigate logo" style={{ maxWidth: '150px', height: 'auto' }} />
      </div>
      <Text variant="h2" style={{ marginBottom: '1rem', textAlign: 'center' }}>
        {t('login.title')}
      </Text>
      <Form onSubmit={handleSubmit}>
        {error && (
          <Text variant="caption" style={{ color: 'red', marginBottom: '0.5rem' }}>
            {error}
          </Text>
        )}
        <FormGroup label={t('login.emailLabel')} htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup label={t('login.passwordLabel')} htmlFor="password" required>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit" style={{ width: '100%' }}>
          {t('login.submitButton')}
        </Button>
      </Form>
      <Text variant="body" style={{ textAlign: 'center', marginTop: '1rem' }}>
        {t('login.newUser')} <Link to="/register">{t('login.registerLink')}</Link>
      </Text>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <LanguageSelector />
      </div>
    </Card>
  );
}