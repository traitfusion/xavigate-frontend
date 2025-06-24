import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Auth from 'aws-amplify/auth';
import { Link } from 'react-router-dom';
import { Card, Form, FormGroup, Input, Button, Text } from '@/design-system/components';
import Icon from '@/design-system/components/Icon';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/Xavigate_Logo.svg';
import { LanguageSelector } from '@/components/language';

export default function Register() {
  const { t } = useTranslation();
  // Registration steps: collect credentials, then profile info, then confirmation
  const [step, setStep] = useState<'credentials'|'profile'|'confirmation'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Validate password meets Cognito requirements: min 8 chars, uppercase, lowercase, number, special char
  const passwordValid = React.useMemo(
    () => /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/.test(password),
    [password]
  );
  // Individual password criteria for live feedback
  const lengthValid = password.length >= 8;
  const uppercaseValid = /[A-Z]/.test(password);
  const lowercaseValid = /[a-z]/.test(password);
  const numberValid = /\d/.test(password);
  const specialValid = /[\W_]/.test(password);
  // Profile info step
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Handle form submit for credentials or profile step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step === 'credentials') {
      // Validate password meets Cognito policy before proceeding
      if (!passwordValid) {
        setError(t('register.passwordRequirements'));
        return;
      }
      // Move to profile info step
      setError(null);
      setStep('profile');
      return;
    }
    if (step === 'profile') {
      // Now perform registration with profile attributes
      setIsLoading(true);
      try {
      await Auth.signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            preferred_username: username,
          }
        }
      });
      // Show confirmation step: prompt email validation
      setStep('confirmation');
      setShowResendButton(true);
      return;
      } catch (err: any) {
        console.error('Registration error', err);
        if (err.code === 'UsernameExistsException') {
          setError(t('register.errors.usernameExists'));
        } else {
          setError(err.message || t('register.errors.registrationFailed'));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleResend = async () => {
    setResendMessage(null);
    setResendLoading(true);
    try {
      // Resend the confirmation code to the user's email
      // Amplify expects an object with username property
      await Auth.resendSignUpCode({ username: email });
      setResendMessage(t('register.resend.success'));
    } catch (err: any) {
      console.error('Resend error', err);
      setResendMessage(t('register.resend.failure'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Card padding="md" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img src={logo} alt="Xavigate logo" style={{ maxWidth: '150px', height: 'auto' }} />
      </div>
      <Text variant="h2" style={{ marginBottom: '1rem', textAlign: 'center' }}>
        {t('profileTab.header').replace('Profile Information', t('register.title') || 'Register')}
      </Text>
      {/* Step: credentials */}
      {step === 'credentials' && (
        <Form onSubmit={handleSubmit}>
          {error && (<Text variant="caption" style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</Text>)}
          <FormGroup label={t('register.emailLabel') || 'Email address'} htmlFor="email" required>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </FormGroup>
          <FormGroup label={t('register.passwordLabel') || 'Password'} htmlFor="password" required>
            <div style={{ position: 'relative' }}>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: '4rem' }}
              />
              <Button
                type="button"
                variant="ghost"
                aria-label={showPassword ? t('register.hidePassword') : t('register.viewPassword')}
                onClick={() => setShowPassword(show => !show)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: 0,
                }}
              >
                <Icon size={20}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </Icon>
              </Button>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 8, marginBottom: 16 }}>
              <li style={{ color: lengthValid ? 'green' : '#888' }}>
                {lengthValid ? '✓ ' : '○ '}{t('register.criteria.length', { min: 8 })}
              </li>
              <li style={{ color: uppercaseValid ? 'green' : '#888' }}>
                {uppercaseValid ? '✓ ' : '○ '}{t('register.criteria.uppercase')}
              </li>
              <li style={{ color: lowercaseValid ? 'green' : '#888' }}>
                {lowercaseValid ? '✓ ' : '○ '}{t('register.criteria.lowercase')}
              </li>
              <li style={{ color: numberValid ? 'green' : '#888' }}>
                {numberValid ? '✓ ' : '○ '}{t('register.criteria.number')}
              </li>
              <li style={{ color: specialValid ? 'green' : '#888' }}>
                {specialValid ? '✓ ' : '○ '}{t('register.criteria.special')}
              </li>
            </ul>
          </FormGroup>
          <Button
            type="submit"
            style={{ width: '100%' }}
            disabled={isLoading || !passwordValid}
          >
            {isLoading
              ? t('register.nextLoading') || 'Loading...'
              : t('register.nextButton') || 'Next'}
          </Button>
          <Text variant="body" style={{ textAlign: 'center', marginTop: '1rem' }}>
            {t('register.haveAccount') || 'Already have an account?'} <Link to="/login">{t('register.signIn') || 'Sign in'}</Link>
          </Text>
        </Form>
      )}
      {/* Step: profile info */}
      {step === 'profile' && (
        <Form onSubmit={handleSubmit}>
          {error && (<Text variant="caption" style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</Text>)}
          <FormGroup label={t('register.firstNameLabel') || 'First Name'} htmlFor="firstName" required>
            <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          </FormGroup>
          <FormGroup label={t('register.lastNameLabel') || 'Last Name'} htmlFor="lastName">
            <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
          </FormGroup>
          <FormGroup label={t('register.usernameLabel') || 'Username'} htmlFor="username" required>
            <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
          </FormGroup>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
              required
            />
            <label htmlFor="terms">
              {t('register.termsLabel') || 'I agree to the Terms and Conditions'}
            </label>
          </div>
          <Button type="submit" style={{ width: '100%' }} disabled={!accepted || isLoading}>
            {isLoading ? t('register.registering') || 'Registering...' : (t('register.registerButton') || 'Register')}
          </Button>
        </Form>
      )}
      {/* Step: confirmation */}
      {step === 'confirmation' && (
        <div style={{ textAlign: 'center' }}>
          <Text variant="h3" style={{ marginBottom: '0.5rem', color: '#047857' }}>
            {t('register.successTitle')}
          </Text>
          <Text variant="body" style={{ marginBottom: '1rem' }}>
            {t('register.successMessage', { email })}
          </Text>
          {showResendButton && (
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={resendLoading}
              style={{ marginBottom: '0.5rem' }}
            >
              {resendLoading ? t('register.resendLoading') : t('register.resendButton')}
            </Button>
          )}
          {resendMessage && (
            <Text
              variant="caption"
              style={{ color: '#047857', display: 'block', marginBottom: '1rem' }}
            >
              {resendMessage}
            </Text>
          )}
          <Text variant="body">
            <Link to="/login">{t('register.returnToLogin')}</Link>
          </Text>
        </div>
      )}
      {/* Language selector at bottom */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <LanguageSelector />
      </div>
    </Card>
  );
}