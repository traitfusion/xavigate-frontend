// In fetchUserProfile.ts
// fetchUserProfile.ts
// Fetches MNTEST result as the user profile data
export const fetchUserProfile = async (userId: string) => {
  try {
    // Call the correct MNTEST result endpoint
    const profileUrl = `/api/mntest/result?userId=${userId}`;
    const response = await fetch(profileUrl, {
      headers: {
        'Authorization': 'Bearer foo'
      }
    });
    if (!response.ok) {
      console.warn(`MNTEST service returned ${response.status}`);
      return { traitScores: {} };
    }
    const data = await response.json();
    return { traitScores: data.traitScores || {} };
  } catch (error) {
    console.warn("Could not connect to MNTEST service, using default profile");
    return { traitScores: {} };
  }
};