// src/api/fetchUserProfile.ts

export interface MnTestResult {
  userId?: string;
  sessionId?: string;
  message?: string;
  traitScores: Record<string, any>;
}

// Log and read your Vite env var (fallback to '/api')
console.log('import.meta.env =', import.meta.env);

export async function fetchUserProfile(
  userId: string,
  token: string
): Promise<MnTestResult> {
  if (!userId) throw new Error('fetchUserProfile: userId is undefined');

  // FIXED: Use relative URL to utilize Vite proxy
  const url = `/api/mntest/result?userId=${encodeURIComponent(userId)}`;
  console.log('About to fetch MNTest at:', url);

  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('MNTest service status:', resp.status);

    if (resp.status === 404) {
      console.warn('No MNTest found → empty scores');
      return { userId, sessionId: '', message: '', traitScores: {} };
    }
    if (resp.status === 500) {
      console.error('MNTest 500 → fallback empty');
      return { userId, sessionId: '', message: '', traitScores: {} };
    }
    if (!resp.ok) {
      const text = await resp.text().catch(() => resp.statusText);
      throw new Error(`MNTest ${resp.status}: ${text}`);
    }

    const data: MnTestResult = await resp.json();
    return data;
  } catch (err) {
    console.error('fetchUserProfile error → defaults:', err);
    return { userId, sessionId: '', message: '', traitScores: {} };
  }
}