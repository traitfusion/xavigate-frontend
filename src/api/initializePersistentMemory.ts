// src/api/initializePersistentMemory.ts

export async function initializePersistentMemory(uuid: string): Promise<void> {
  const API = '/api';

  const res = await fetch(`${API}/persistent-memory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uuid,
      preferences: {}, // can extend later
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`❌ Failed to initialize persistent memory (${res.status}): ${err}`);
  }

  console.log('✅ Persistent memory initialized for', uuid);
}
