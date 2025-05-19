// src/api/api.ts
// Centralized API calls for backend interactions using relative paths and CRA proxy.

// API URL prefix: default to '/api'
const PREFIX = '/api';
// Auth token from env var
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN || '';

export type SessionMemory = {
  messages: any[];
};

/**
 * Fetch the stored session memory for a given UUID.
 */
export async function fetchSessionMemory(uuid: string): Promise<SessionMemory | null> {
  // Match backend endpoint for session memory
  const res = await fetch(`${PREFIX}/session-memory/${uuid}`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });
  if (!res.ok) {
    console.error('fetchSessionMemory failed:', res.status, res.statusText);
    return null;
  }
  return res.json();
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
  // Match backend endpoint for generation
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