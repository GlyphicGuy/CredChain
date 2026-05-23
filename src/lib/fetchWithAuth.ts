export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let devRole = null;
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(^| )dev_role=([^;]+)/);
    if (match) devRole = match[2];
  }

  const headers = {
    ...options.headers,
    ...(devRole && process.env.NEXT_PUBLIC_DEV_MODE === 'true' ? { 'X-DEV-ROLE': devRole } : {})
  };

  // Replace localhost with dynamic hostname to fix Safari/mobile TypeError issues
  let finalUrl = url;
  if (typeof window !== 'undefined' && finalUrl.includes('localhost')) {
    finalUrl = finalUrl.replace('localhost', window.location.hostname);
  }

  return fetch(finalUrl, { ...options, headers });
}
