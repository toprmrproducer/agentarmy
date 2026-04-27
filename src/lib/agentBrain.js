// Real LLM wrapper. Prefers Anthropic, falls back to OpenAI, then Groq, then Gemini.
// When no key is configured, callers should fall back to the simulated payload.
//
// SECURITY: keys live in the browser. Anthropic and OpenAI both require an extra
// "dangerous" flag for direct browser usage. Use a Netlify Function in production.

import { effectiveKey } from './storage';

export function detectActiveProvider() {
  if (effectiveKey('VITE_ANTHROPIC_API_KEY')) return 'anthropic';
  if (effectiveKey('VITE_OPENAI_API_KEY'))     return 'openai';
  if (effectiveKey('VITE_GROQ_API_KEY'))       return 'groq';
  if (effectiveKey('VITE_GEMINI_API_KEY'))     return 'gemini';
  return null;
}

const CEO_SYSTEM_PROMPT = `You are the CEO Agent of an autonomous multi-agent enterprise. The user submits a high-level business goal. You decompose it into specific, actionable tasks and assign each to one of these C-suite reports:

- cmo (Chief Marketing Officer): brand, campaigns, content
- cto (Chief Technology Officer): infrastructure, dev, deploys
- cso (Chief Sales Officer): pipeline, prospecting, deals
- coo (Chief Operating Officer): cross-functional execution, workflows
- cfo (Chief Financial Officer): budget, ROI, financial controls

Respond with JSON ONLY, no prose, in this exact shape:
{
  "tasks": [
    { "department": "cmo", "description": "..." },
    { "department": "cto", "description": "..." },
    { "department": "cso", "description": "..." },
    { "department": "coo", "description": "..." },
    { "department": "cfo", "description": "..." }
  ]
}

Each description must be specific to the user's goal — no generic boilerplate. Keep each under 25 words.`;

async function callAnthropic(prompt) {
  const key = effectiveKey('VITE_ANTHROPIC_API_KEY');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: CEO_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function callOpenAI(prompt) {
  const key = effectiveKey('VITE_OPENAI_API_KEY');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: CEO_SYSTEM_PROMPT },
        { role: 'user',   content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callGroq(prompt) {
  const key = effectiveKey('VITE_GROQ_API_KEY');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: CEO_SYSTEM_PROMPT },
        { role: 'user',   content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callGemini(prompt) {
  const key = effectiveKey('VITE_GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: CEO_SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function extractJson(text) {
  if (!text) return null;
  // Some models wrap JSON in markdown code fences.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = fenced ? fenced[1] : text;
  try {
    return JSON.parse(candidate);
  } catch {
    // Try to find the first {...} block.
    const m = candidate.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch { return null; }
    }
    return null;
  }
}

export async function decomposeGoal(prompt) {
  const provider = detectActiveProvider();
  if (!provider) return { provider: null, tasks: null };

  let raw = '';
  try {
    if      (provider === 'anthropic') raw = await callAnthropic(prompt);
    else if (provider === 'openai')    raw = await callOpenAI(prompt);
    else if (provider === 'groq')      raw = await callGroq(prompt);
    else if (provider === 'gemini')    raw = await callGemini(prompt);
  } catch (err) {
    console.error('[agentBrain] LLM call failed:', err);
    return { provider, tasks: null, error: err.message };
  }

  const parsed = extractJson(raw);
  if (!parsed?.tasks?.length) return { provider, tasks: null, error: 'Could not parse tasks from response', raw };
  return { provider, tasks: parsed.tasks };
}
