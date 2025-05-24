// src/api/submitMNAnswers.ts

export interface MNAnswerPayload {
  uuid: string;
  answers: Record<string, number[]>; // e.g. { creative: [4, 4, 5, 3], educative: [2, 3, 1, 2] }
}

export async function submitMNAnswers(payload: MNAnswerPayload): Promise<void> {
  const API = `${import.meta.env.VITE_BACKEND_URL}`;

  const res = await fetch(`${API}/mntest/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`❌ MN answer submission failed (${res.status}): ${error}`);
  }

  console.log('✅ MN answers submitted successfully');
}
