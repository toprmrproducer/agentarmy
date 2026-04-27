import React, { useState } from 'react';
import { ListChecks, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { AGENT_META } from './AgentModal';
import { getApisByAgent, TIER_META } from '../lib/apiCatalog';
import { loadKeys } from '../lib/storage';

function Pill({ tier }) {
  const t = TIER_META[tier];
  return <span style={{ fontSize: '0.6rem', fontWeight: 700, color: t.color, background: t.bg, padding: '2px 6px', borderRadius: 999, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t.label}</span>;
}

export default function SetupGuide() {
  const [open, setOpen] = useState(false);
  const keys = loadKeys();

  return (
    <section style={{ marginBottom: 28 }}>
      <div className="card" style={{ padding: open ? 22 : '14px 22px' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ListChecks size={16} color="var(--text-secondary)" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Per-Agent Setup Guide</span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              what each agent needs to be fully autonomous
            </span>
          </div>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {open && (
          <div style={{ marginTop: 18 }} className="animate-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {Object.entries(AGENT_META).map(([id, meta]) => {
                const agentApis = getApisByAgent(id);
                if (agentApis.length === 0) return null;
                const liveApis = agentApis.filter(a => keys[a.envKey] && keys[a.envKey].length > 8);

                return (
                  <div key={id} style={{ border: '1px solid var(--border-color)', borderRadius: 12, padding: 14, background: 'var(--bg-canvas)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div className="agent-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', background: `${meta.color}18`, color: meta.color, borderRadius: 8 }}>
                        {meta.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{meta.fullName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {liveApis.length}/{agentApis.length} integrations live
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {agentApis.map(api => {
                        const isLive = keys[api.envKey] && keys[api.envKey].length > 8;
                        return (
                          <div key={api.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--bg-soft)', borderRadius: 7 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isLive ? 'var(--status-completed)' : 'var(--text-subtle)', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.78rem', fontWeight: 500, flex: 1 }}>{api.name}</span>
                            <Pill tier={api.tier} />
                            <a href={api.signupUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
