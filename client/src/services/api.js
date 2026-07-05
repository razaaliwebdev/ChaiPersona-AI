const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function sendChatMessage(personaId, messages) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personaId, messages }),
    });
  } catch {
    throw new Error('Cannot reach server. Make sure the backend is running on port 3000.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Server returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Failed to get AI response');
  }

  return data;
}

export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return response.ok && data.success;
  } catch {
    return false;
  }
}
