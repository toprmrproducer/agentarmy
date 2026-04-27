import React, { useState, useMemo } from 'react';
import { Sparkles, Brain, ChevronRight, ChevronLeft, ExternalLink, Check, KeyRound, ShieldCheck, Zap } from 'lucide-react';
import { APIS, CATEGORIES, TIER_META, getApisByAgent } from '../lib/apiCatalog';
import { AGENT_META } from './AgentModal';
import { setKey, markOnboarded, loadKeys } from '../lib/storage';

const STEPS = ['welcome', 'brain', 'agents', 'apis', 'review'];

function Pill({ tier }) {
  const t = TIER_META[tier];
  return <span style={{ fontSize: '0.65rem', fontWeight: 700, color: t.color, background: t.bg, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t.label}</span>;
}

function McpBadge({ mcp }) {
  if (!mcp) return null;
  const label = mcp === 'official' ? 'Official MCP' : mcp === 'community' ? 'Community MCP' : 'Hosts MCPs';
  return (
    <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#7c3aed', background: '#ede9fe', padding: '2px 7px', borderRadius: 999, letterSpacing: '0.04em' }}>
      {label}
    </span>
  );
}

function ApiKeyInput({ api, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', flex: 1 }}>
      <KeyRound size={12} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
      <input
        type={show ? 'text' : 'password'}
        className="input-field"
        placeholder={api.envKey}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        style={{ paddingLeft: 28, paddingRight: 50, fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', padding: '8px 50px 8px 28px' }}
      />
      <button onClick={() => setShow(s => !s)} className="btn btn-ghost" style={{ position: 'absolute', right: 4, padding: '4px 8px', fontSize: '0.7rem' }}>
        {show ? 'hide' : 'show'}
      </button>
    </div>
  );
}

export default function OnboardingWizard({ onClose }) {
  const [step, setStep] = useState(0);
  const [selectedAgents, setSelectedAgents] = useState(['ceo', 'mktHead', 'salesHead', 'leadDev']);
  const [keys, setKeys] = useState(loadKeys());

  const updateKey = (envKey, value) => {
    setKeys(prev => ({ ...prev, [envKey]: value }));
  };

  // APIs needed for the selected agent set, plus all brain APIs.
  const requiredApis = useMemo(() => {
    const set = new Set();
    selectedAgents.forEach(id => getApisByAgent(id).forEach(a => set.add(a.id)));
    APIS.filter(a => a.category === 'brain').forEach(a => set.add(a.id));
    return APIS.filter(a => set.has(a.id));
  }, [selectedAgents]);

  const brainKeysSet = ['VITE_ANTHROPIC_API_KEY','VITE_OPENAI_API_KEY','VITE_GROQ_API_KEY','VITE_GEMINI_API_KEY'].some(k => keys[k]);

  const persist = () => {
    Object.entries(keys).forEach(([k, v]) => setKey(k, v));
    markOnboarded();
    onClose(true);
  };

  const skip = () => { markOnboarded(); onClose(false); };
  const next = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 780 }}>
        {/* Header / progress */}
        <div style={{ padding: '24px 32px 18px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="brand-mark" style={{ width: 36, height: 36 }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Agent Army Setup</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Step {step + 1} of {STEPS.length}</div>
              </div>
            </div>
            <button onClick={skip} className="btn btn-ghost" style={{ fontSize: '0.78rem' }}>Skip — use simulation</button>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= step ? 'var(--accent)' : 'var(--border-color)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '28px 32px', minHeight: 380 }}>
          {/* ── Welcome ── */}
          {step === 0 && (
            <div className="animate-in">
              <h2 style={{ marginBottom: 12, fontSize: '1.6rem' }}>Welcome to your autonomous fleet.</h2>
              <p style={{ marginBottom: 22, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Agent Army is a multi-agent orchestrator. A CEO agent decomposes your goal, then 14 specialist agents execute in parallel — each one wired to the real APIs they need.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 22 }}>
                {[
                  { Icon: Brain, label: 'Real LLM brain', desc: 'Claude · GPT-4 · Groq · Gemini' },
                  { Icon: Zap,   label: '30+ integrations', desc: 'Marketing, sales, dev, finance' },
                  { Icon: ShieldCheck, label: 'Local-only keys', desc: 'Stored in your browser' },
                ].map(({ Icon, label, desc }) => (
                  <div key={label} style={{ background: 'var(--bg-soft)', padding: 14, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                    <Icon size={16} color="var(--accent)" />
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginTop: 6 }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                We'll walk you through which APIs each agent needs. Most have a free tier. You can skip any step and add keys later from the API panel.
              </p>
            </div>
          )}

          {/* ── Brain ── */}
          {step === 1 && (
            <div className="animate-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Brain size={18} color="var(--accent)" />
                <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Pick your LLM brain</h2>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 18 }}>
                The brain decomposes goals and powers every agent's reasoning. Pick at least one — we recommend Claude for quality or Groq if you want free.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {APIS.filter(a => a.category === 'brain').map(api => (
                  <div key={api.id} style={{
                    border: keys[api.envKey] ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                    borderRadius: 12, padding: 14,
                    background: keys[api.envKey] ? 'var(--accent-soft)' : 'var(--bg-canvas)',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{api.name}</span>
                      <Pill tier={api.tier} />
                      {api.id === 'groq' && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 7px', borderRadius: 999 }}>RECOMMENDED FREE</span>}
                      {api.id === 'anthropic' && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#7c3aed', background: '#ede9fe', padding: '2px 7px', borderRadius: 999 }}>BEST QUALITY</span>}
                      <a href={api.signupUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        Get key <ExternalLink size={11} />
                      </a>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{api.desc}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                      <strong>Free tier:</strong> {api.freeTier} · <strong>Pricing:</strong> {api.pricing}
                    </div>
                    <ApiKeyInput api={api} value={keys[api.envKey]} onChange={(v) => updateKey(api.envKey, v)} />
                  </div>
                ))}
              </div>
              {!brainKeysSet && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 12 }}>
                  No brain key? No problem — the system will run in simulation mode for the demo.
                </p>
              )}
            </div>
          )}

          {/* ── Agents ── */}
          {step === 2 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>Activate the agents you need</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 18 }}>
                Toggle on only the agents you'll use today. We'll only ask for APIs they need. You can change this anytime.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.keys(AGENT_META).map(id => {
                  const meta = AGENT_META[id];
                  const active = selectedAgents.includes(id);
                  const isCEO = id === 'ceo';
                  return (
                    <button
                      key={id}
                      disabled={isCEO}
                      onClick={() => setSelectedAgents(prev => active ? prev.filter(x => x !== id) : [...prev, id])}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10, cursor: isCEO ? 'not-allowed' : 'pointer',
                        border: active ? `1px solid ${meta.color}` : '1px solid var(--border-color)',
                        background: active ? `${meta.color}10` : 'var(--bg-canvas)',
                        textAlign: 'left', fontFamily: 'inherit',
                        opacity: isCEO ? 0.7 : 1,
                      }}
                    >
                      <div className="agent-avatar" style={{ width: 28, height: 28, fontSize: '0.65rem', background: `${meta.color}18`, color: meta.color, borderRadius: 7 }}>
                        {meta.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{meta.fullName}</div>
                        {isCEO && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Always on</div>}
                      </div>
                      {active && <Check size={14} color={meta.color} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── APIs ── */}
          {step === 3 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>Connect agent integrations</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 18 }}>
                Based on your selected agents, here are the integrations they can use. All are optional — leave blank to run that agent in simulation mode.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
                {requiredApis.filter(a => a.category !== 'brain').map(api => (
                  <div key={api.id} style={{ border: '1px solid var(--border-color)', borderRadius: 10, padding: 12, background: 'var(--bg-canvas)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.87rem' }}>{api.name}</span>
                      <Pill tier={api.tier} />
                      <McpBadge mcp={api.mcp} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>· {CATEGORIES[api.category].label}</span>
                      <a href={api.signupUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        Get key <ExternalLink size={10} />
                      </a>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      {api.desc} · <strong>Free:</strong> {api.freeTier}
                    </div>
                    <ApiKeyInput api={api} value={keys[api.envKey]} onChange={(v) => updateKey(api.envKey, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Review ── */}
          {step === 4 && (
            <div className="animate-in">
              <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>You're set.</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 22 }}>
                Here's what's wired up. Agents without keys run in simulation — same UI, generated outputs.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                <div style={{ background: 'var(--bg-soft)', padding: 14, borderRadius: 10, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Brain</div>
                  <div style={{ fontWeight: 700, fontSize: '1.4rem', color: brainKeysSet ? 'var(--status-completed)' : 'var(--text-muted)' }}>
                    {brainKeysSet ? 'Live' : 'Simulated'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-soft)', padding: 14, borderRadius: 10, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Active agents</div>
                  <div style={{ fontWeight: 700, fontSize: '1.4rem' }}>{selectedAgents.length} / {Object.keys(AGENT_META).length}</div>
                </div>
                <div style={{ background: 'var(--bg-soft)', padding: 14, borderRadius: 10, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Integrations</div>
                  <div style={{ fontWeight: 700, fontSize: '1.4rem' }}>{Object.keys(keys).filter(k => keys[k]).length}</div>
                </div>
                <div style={{ background: 'var(--bg-soft)', padding: 14, borderRadius: 10, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Storage</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: 2 }}>browser · localStorage</div>
                </div>
              </div>
              <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: '10px 14px', fontSize: '0.78rem', color: '#92400e', lineHeight: 1.5 }}>
                <strong>Production tip:</strong> Browser-stored keys are fine for solo dev/demo. For shared deployments, move secrets into a Netlify Function or backend and call providers server-side.
              </div>
            </div>
          )}
        </div>

        {/* Footer / nav */}
        <div style={{ padding: '16px 32px 22px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <button onClick={prev} disabled={step === 0} className="btn btn-secondary" style={{ opacity: step === 0 ? 0.4 : 1 }}>
            <ChevronLeft size={14} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="btn btn-primary">
              Continue <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={persist} className="btn btn-accent">
              <Check size={14} /> Save & Launch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
