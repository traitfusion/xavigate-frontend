// src/api/api.ts
// Centralized API calls for backend interactions using relative paths and CRA proxy.

// API URL prefix: default to '/api'
const PREFIX = import.meta.env.VITE_BACKEND_URL;

// Handle both Vite and CRA environments
const AUTH_TOKEN =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_AUTH_TOKEN) ||
    //load from .env file
    
  
  '';

const EXTERNAL_ENDPOINTS = {
  mntest:
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_BACKEND_URL) ||
    'http://chat.xavigate.com/api',
};

export type SessionMemory = {
  messages: any[];
};

export interface TraitScores {
  [key: string]: number;
}


/**
 * Fetch trait scores from MNTEST service.
 * Tries multiple endpoints with fallbacks.
 */
export async function fetchTraitScores(userId: string, idToken?: string): Promise<TraitScores | null> {
  const endpoints = [
    { url: `${PREFIX}/mntest/result`, name: 'Local API' },
    { url: `${import.meta.env.VITE_BACKEND_URL}/mntest/result`, name: 'External API' }
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying ${endpoint.name} at: ${endpoint.url}?userId=${userId}`);

      const res = await fetch(`${endpoint.url}?userId=${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken || AUTH_TOKEN}`,
        }
      });

      if (res.status === 404) {
        console.log(`No test results found (404) from ${endpoint.name}`);
        return {};
      }

      if (!res.ok) {
        console.error(`${endpoint.name} request failed:`, res.status, res.statusText);
        lastError = new Error(`HTTP ${res.status}: ${res.statusText}`);
        continue;
      }

      const data = await res.json();

      if (data?.traitScores) {
        console.log(`Successfully fetched trait scores from ${endpoint.name}`);
        return data.traitScores;
      } else {
        console.warn(`${endpoint.name} returned valid response but missing traitScores:`, data);
        lastError = new Error('Missing trait scores in response');
      }
    } catch (error) {
      console.error(`Error fetching from ${endpoint.name}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  console.error('All endpoints failed for trait scores fetch', lastError);
  return null;
}

export interface GenerateParams {
  prompt: string;
  uuid: string;
  avatar: string;
  tone: string;
}

export interface GenerateResponse {
  answer: string;
  sources?: any[];
  followup?: string;
}

/**
 * Call the backend generate endpoint to get the assistant response.
 */
export async function generateResponse(
  params: GenerateParams
): Promise<GenerateResponse | null> {
  const res = await fetch(`${PREFIX}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    console.error('generateResponse failed:', res.status, res.statusText);
    return null;
  }
  return res.json();
}

/**
 * Submit trait scores to MNTEST service.
 */
export async function submitTraitScores(
  userId: string,
  traitScores: TraitScores,
  idToken?: string
): Promise<boolean> {
  const url = `${PREFIX}/mntest/submit`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken || AUTH_TOKEN}`,
      },
      body: JSON.stringify({ userId, traitScores }),
    });

    if (!res.ok) {
      console.error(`❌ Submit failed: ${res.status}`, await res.text());
      return false;
    }

    console.log('✅ Trait scores submitted successfully');
    return true;
  } catch (err) {
    console.error('🚨 Error submitting trait scores:', err);
    return false;
  }
}
