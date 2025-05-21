// In fetchUserProfile.ts
// fetchUserProfile.ts


// Fetches the user profile data from the backend
// Fetches MNTEST results (traitScores) from the backend
// MnTestResult represents the shape of data returned by fetchUserProfile
export interface MnTestResult {
  // Optional identifiers for default responses
  userId?: string;
  sessionId?: string;
  message?: string;
  traitScores: Record<string, any>;
}
export async function fetchUserProfile(
  userId: string,
  token: string
): Promise<MnTestResult> {
  if (!userId) {
    throw new Error('fetchUserProfile: userId is undefined');
  }
  const url = `/api/mntest/result?userId=${encodeURIComponent(userId)}`;
  console.log('About to fetch MNTest at:', url);
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('MNTest service status:', resp.status);
    if (resp.status === 404) {
      console.warn(`MNTest result not found for user ${userId}, returning empty scores`);
      return { userId, sessionId: '', message: '', traitScores: {} };
    }
    if (!resp.ok) {
      throw new Error(`MNTest service returned ${resp.status}`);
    }
    const data: MnTestResult = await resp.json();
    return data;
  } catch (err) {
    console.error('Error fetching MNTest result, returning defaults:', err);
    return { userId, sessionId: '', message: '', traitScores: {} };
  }
}