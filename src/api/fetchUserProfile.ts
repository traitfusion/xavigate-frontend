// src/api/fetchUserProfile.ts

export interface UserProfile {
  uuid: string;
  name: string;
  traits: Record<string, number[]>; // e.g., { creative: [4, 4, 3, 5] }
  avatarProfile?: {
    avatar_id: string;
    prompt_framing: string;
  };
  onboardingCompleted?: boolean;
}

export async function fetchUserProfile(uuid: string): Promise<UserProfile> {
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8010';

  const res = await fetch(`${API}/profile/${uuid}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`❌ Failed to fetch profile (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data;
}
