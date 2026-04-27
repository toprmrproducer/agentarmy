import React, { useState, useMemo } from 'react';
import { Plug, KeyRound, ChevronDown, ChevronUp, ExternalLink, Search, Check } from 'lucide-react';
import { APIS, CATEGORIES, TIER_META } from '../lib/apiCatalog';
import { AGENT_META } from './AgentModal';
import { loadKeys, setKey } from '../lib/storage';

function Pill({ tier }) {
  const t = TIER_META[tier];
  return <span style={{ fontSize: '0.62rem', fontWeight: 700, color: t.color, background: t.bg, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t.label}</span>;
}

function McpBadge({ mcp }) {
  if (!mcp) return null;
  const label = mcp === 'official' ? '★ Official MCP' : mcp === 'community' ? 'Community MCP' : 'Hosts MCPs';
  return (
    <span title="Model Context Protocol — works in Claude Desktop"
      style={{ fontSize: '0.6rem', fontWeight: 600, color: '#7c3aed', background: '#ede9fe', padding: '2px 7px', borderRadius: 999 }}>
      {label}
    </span>
  );
}

function ApiCard({ api, value, onSave }) {
  const [v, setV] = useState(value || '');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const isConnected = (value || '').length > 8;

  const save = () => {
    onSave(api.envKey, v);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  return (
    <div className="api-card" style={{ borderColor: isConnected ? 'var(--status-completed)' : 'var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div className="api-icon">{api.name.slice(0, 2).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{api.name}</span>
            <Pill tier={api.tier} />
            <McpBadge mcp={api.mcp} />
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{api.desc}</div>
        </div>
        <span className={isConnected ? 'badge badge-completed' : 'badge badge-idle'} style={{ flexShrink: 0 }}>
          {isConnected ? '● live' : '○ off'}
        </span>
      </div>

      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Free:</strong> {api.freeTier}
      </div>

      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
        Used by: {api.agents?.slice(0, 3).map(a => AGENT_META[a]?.fullName.replace(/^Chief /, 'C-').replace(/^Head of /, '')).join(', ')}
        {api.agents?.length > 3 ? ` +${api.agents.length - 3}` : ''}
      </div>

      <div style={{ position: 'relative' }}>
        <KeyRound size={11} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type={show ? 'text' : 'password'}
          className="input-field"
          placeholder={api.envKey}
          value={v}
          onChange={e => setV(e.target.value)}
          style={{ paddingLeft: 26, paddingRight: 80, fontSize: '0.74rem', fontFamily: 'JetBrains Mono, monospace', padding: '7px 80px 7px 26px' }}
        />
        <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 2 }}>
          <button onClick={() => setShow(s => !s)} className="btn btn-ghost" style={{ padding: '3px 6px', fontSize: '0.68rem' }}>{show ? 'hide' : 'show'}</button>
          <button onClick={save} className="btn btn-primary" style={{ padding: '3px 8px', fontSize: '0.68rem' }}>
            {saved ? <Check size={11} /> : 'save'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem' }}>
        <a href={api.signupUrl} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
          Get key <ExternalLink size={10} />
        </a>
        <a href={api.docsUrl} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          docs ↗
        </a>
      </div>
    </div>
  );
}

export default function ApiPanel({ onKeysChanged }) {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [keys, setKeys] = useState(loadKeys());

  const handleSave = (envKey, value) => {
    setKey(envKey, value);
    setKeys(loadKeys());
    onKeysChanged && onKeysChanged();
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return APIS.filter(a => {
      if (activeCat !== 'all' && a.category !== activeCat) return false;
      if (tierFilter !== 'all' && a.tier !== tierFilter) return false;
      if (q && !(a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [activeCat, tierFilter, query]);

  const liveCount = Object.values(keys).filter(v => v && v.length > 8).length;

  return (
    <section style={{ marginBottom: 28 }}>
      <div className="card" style={{ padding: open ? 22 : '14px 22px' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Plug size={16} color="var(--text-secondary)" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>API Integrations</span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {APIS.length} integrations · <strong style={{ color: 'var(--status-completed)' }}>{liveCount} live</strong>
            </span>
          </div>
          {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </button>

        {open && (
          <div style={{ marginTop: 18 }} className="animate-in">
            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
              <div style={{ position: 'relative', minWidth: 200, flex: 1 }}>
                <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-field"
                  placeholder="Search integrations…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{ paddingLeft: 28, fontSize: '0.82rem', padding: '8px 10px 8px 28px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['all', 'free', 'freemium', 'paid'].map(t => (
                  <button key={t} onClick={() => setTierFilter(t)}
                    className={tierFilter === t ? 'tab tab-active' : 'tab'}
                    style={{ padding: '6px 10px', fontSize: '0.74rem', textTransform: 'capitalize' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              <button onClick={() => setActiveCat('all')}
                className={activeCat === 'all' ? 'tab tab-active' : 'tab'}
                style={{ padding: '5px 10px', fontSize: '0.74rem' }}>
                All ({APIS.length})
              </button>
              {Object.values(CATEGORIES).map(c => {
                const count = APIS.filter(a => a.category === c.id).length;
                return (
                  <button key={c.id} onClick={() => setActiveCat(c.id)}
                    className={activeCat === c.id ? 'tab tab-active' : 'tab'}
                    style={{ padding: '5px 10px', fontSize: '0.74rem' }}>
                    {c.label} ({count})
                  </button>
                );
              })}
            </div>

            {activeCat !== 'all' && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 12px', fontStyle: 'italic' }}>
                {CATEGORIES[activeCat].desc}
              </p>
            )}

            <div className="api-grid">
              {filtered.map(api => (
                <ApiCard key={api.id} api={api} value={keys[api.envKey]} onSave={handleSave} />
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No integrations match those filters.
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.5 }}>
              Keys are saved to your browser <code style={{ background: 'var(--bg-soft)', padding: '1px 5px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace' }}>localStorage</code>. For production, set them in Netlify env vars as <code style={{ background: 'var(--bg-soft)', padding: '1px 5px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace' }}>VITE_*</code>. <strong>★ Official MCP</strong> means a Model Context Protocol server exists for Claude Desktop.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
