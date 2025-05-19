// utils/auth.ts
// Helpers for AWS Cognito PKCE Authorization Code flow

// Derive Cognito domain from awsConfig or env var
import { awsConfig } from '../aws.exports';
const { region: COGNITO_REGION, userPoolId: USER_POOL_ID, userPoolClientId: USER_POOL_CLIENT_ID } =
  awsConfig.Auth.Cognito;
// Derive default domain prefix: region + pool suffix (lowercased)
const [regionPrefix, poolSuffix] = USER_POOL_ID.split('_');
const DEFAULT_DOMAIN_PREFIX = `${regionPrefix}${poolSuffix.toLowerCase()}`;
const COGNITO_DOMAIN =
  process.env.REACT_APP_COGNITO_DOMAIN ||
  `https://${DEFAULT_DOMAIN_PREFIX}.auth.${COGNITO_REGION}.amazoncognito.com`;

// Cognito App Client ID
// Cognito App Client ID from awsConfig or env var
const CLIENT_ID =
  process.env.REACT_APP_COGNITO_CLIENT_ID ||
  USER_POOL_CLIENT_ID;

const SCOPES = process.env.REACT_APP_COGNITO_SCOPES || 'openid email phone';

function getRedirectUri(): string {
  // Always use the PKCE callback route
  return `${window.location.origin}/auth/callback`;
}

/**
 * Base64-urlencodes an ArrayBuffer
 */
export function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generates a random code verifier for PKCE
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64urlEncode(array.buffer);
}

/**
 * Generates a code challenge from the verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(digest);
}

/**
 * Redirects the user to the Cognito Hosted UI to start the login flow
 */
export async function login(): Promise<void> {
  try {
    console.log('Starting login process...');
    const verifier = generateCodeVerifier();
    console.log('Code verifier generated');
    const challenge = await generateCodeChallenge(verifier);
    console.log('Code challenge generated');
    
    // Store verifier in localStorage for later use
    localStorage.setItem('pkce_verifier', verifier);
    console.log('Verifier stored in localStorage');
    
    const redirectUri = getRedirectUri();
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      scope: SCOPES,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
    
    const authUrl = `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
    console.log('Redirecting to:', authUrl);
    
    // Redirect the user to the Cognito Hosted UI
    window.location.assign(authUrl);
  } catch (error) {
    console.error('Login initialization error:', error);
    throw error;
  }
}

/**
 * Exchange the authorization code for tokens.
 */
export async function handleAuthCallback(): Promise<{
  id_token: string;
  access_token: string;
  refresh_token?: string;
}> {
  console.log('Handling auth callback...');
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  console.log('Authorization code present:', !!code);
  
  if (!code) {
    console.error('No code found in URL');
    throw new Error('Authorization code not found');
  }
  
  const verifier = localStorage.getItem('pkce_verifier');
  console.log('PKCE verifier present:', !!verifier);
  
  if (!verifier) {
    console.error('No PKCE verifier found in localStorage');
    throw new Error('PKCE verifier not found');
  }
  
  const redirectUri = getRedirectUri();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });
  
  console.log('Making token request to:', `${COGNITO_DOMAIN}/oauth2/token`);
  console.log('Request details:', {
    clientId: CLIENT_ID,
    redirectUri, 
    codeVerifierLength: verifier.length
  });
  
  try {
    const resp = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    
    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Token exchange failed:', {
        status: resp.status,
        statusText: resp.statusText,
        error: errorText
      });
      throw new Error(`Token exchange failed: ${resp.status} ${errorText}`);
    }
    
    const tokens = await resp.json();
    console.log('Token exchange successful');
    
    // Clear the verifier as it's no longer needed
    localStorage.removeItem('pkce_verifier');
    
    return tokens;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
}

/**
 * Refresh the access and ID tokens using a refresh token.
 */
export async function refreshTokens(
  refreshToken: string,
): Promise<{
  id_token: string;
  access_token: string;
  refresh_token?: string;
}> {
  console.log('Refreshing tokens...');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });
  
  try {
    const resp = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    
    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Refresh token failed:', {
        status: resp.status,
        statusText: resp.statusText,
        error: errorText
      });
      throw new Error(`Refresh token failed: ${resp.status} ${errorText}`);
    }
    
    const tokens = await resp.json();
    console.log('Tokens refreshed successfully');
    return tokens;
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
}

/**
 * Parse a JWT and return its payload.
 */
export function parseJwt(token: string): any {
  try {
    const [, payload] = token.split('.');
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(b64);
    return JSON.parse(json);
  } catch (err) {
    console.error('JWT parse error:', err);
    return {};
  }
}

/**
 * Logout the user
 */
export function logout(): void {
  // Clear PKCE verifier and all tokens from storage
  localStorage.removeItem('pkce_verifier');
  localStorage.removeItem('id_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  // Redirect to Cognito Hosted UI logout endpoint
  const logoutUrl = new URL(`${COGNITO_DOMAIN}/logout`);
  logoutUrl.searchParams.set('client_id', CLIENT_ID);
  // Use application origin with trailing slash (must exactly match allowed sign-out URL in Cognito)
  const originSlash = window.location.origin.endsWith('/')
    ? window.location.origin
    : `${window.location.origin}/`;
  logoutUrl.searchParams.set('logout_uri', originSlash);
  // Redirect to clear server-side session and return to app
  window.location.assign(logoutUrl.toString());
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  const idToken = localStorage.getItem('id_token');
  if (!idToken) return false;
  
  try {
    const payload = parseJwt(idToken);
    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    return false;
  }
}

/**
 * Get the current user's info from the ID token
 */
export function getUserInfo() {
  const idToken = localStorage.getItem('id_token');
  if (!idToken) return null;
  
  return parseJwt(idToken);
}