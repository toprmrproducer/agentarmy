// Lightweight wrapper around localStorage for API keys and onboarding state.
// Keys are stored locally only and never leave the browser unless an agent
// explicitly calls a provider's API. For production, swap to a backend.

const KEYS_NAMESPACE = 'agentarmy.keys.v1';
const ONBOARDED_KEY  = 'agentarmy.onboarded.v1';

export function loadKeys() {
  try {
    const raw = localStorage.getItem(KEYS_NAMESPACE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveKeys(map) {
  try {
    localStorage.setItem(KEYS_NAMESPACE, JSON.stringify(map || {}));
  } catch {}
}

export function setKey(envKey, value) {
  const m = loadKeys();
  if (!value) delete m[envKey];
  else m[envKey] = value;
  saveKeys(m);
  return m;
}

export function getKey(envKey) {
  return loadKeys()[envKey] || null;
}

// Merge live storage with Vite env (env vars take precedence as a build-time source).
export function effectiveKey(envKey) {
  const fromEnv = import.meta.env?.[envKey];
  if (fromEnv) return fromEnv;
  return getKey(envKey);
}

export function isOnboarded() {
  try { return localStorage.getItem(ONBOARDED_KEY) === '1'; } catch { return false; }
}

export function markOnboarded() {
  try { localStorage.setItem(ONBOARDED_KEY, '1'); } catch {}
}

export function resetOnboarding() {
  try { localStorage.removeItem(ONBOARDED_KEY); } catch {}
}
