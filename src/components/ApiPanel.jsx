import React, { useState } from 'react';
import { Plug, KeyRound, ChevronDown, ChevronUp } from 'lucide-react';

const APIS = [
  { id: 'openai',     name: 'OpenAI',         tag: 'AI',          desc: 'GPT-4 reasoning + completions',  envKey: 'OPENAI_API_KEY' },
  { id: 'anthropic',  name: 'Anthropic',      tag: 'AI',          desc: 'Claude orchestration & writing', envKey: 'ANTHROPIC_API_KEY' },
  { id: 'instagram',  name: 'Instagram',      tag: 'Social',      desc: 'Profile audit + reel analytics', envKey: 'INSTAGRAM_GRAPH_TOKEN' },
  { id: 'slack',      name: 'Slack',          tag: 'Comms',       desc: 'Internal alerts & approvals',     envKey: 'SLACK_BOT_TOKEN' },
  { id: 'gmail',      name: 'Gmail',          tag: 'Outreach',    desc: 'Cold email & sequencing',         envKey: 'GMAIL_OAUTH_TOKEN' },
  { id: 'stripe',     name: 'Stripe',         tag: 'Payments',    desc: 'Revenue & spend tracking',        envKey: 'STRIPE_SECRET_KEY' },
  { id: 'github',     name: 'GitHub',         tag: 'Dev',         desc: 'Repo + deploy automation',        envKey: 'GITHUB_TOKEN' },
  { id: 'linear',     name: 'Linear',         tag: 'Project',     desc: 'Issue tracking & sprints',        envKey: 'LINEAR_API_KEY' },
  { id: 'hubspot',    name: 'HubSpot',        tag: 'CRM',         desc: 'Lead pipeline & deals',           envKey: 'HUBSPOT_API_KEY' },
  { id: 'aws',        name: 'AWS',            tag: 'Infra',       desc: 'Auto-scaling & monitoring',       envKey: 'AWS_ACCESS_KEY_ID' },
];

function ApiCard({ api }) {
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const isConnected = value.length > 8;

  return (
    <div className="api-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div className="api-icon">{api.name.slice(0, 2).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{api.name}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'var(--bg-soft)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border-color)' }}>{api.tag}</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>{api.desc}</div>
        </div>
        <span className={isConnected ? 'badge badge-completed' : 'badge badge-idle'} style={{ flexShrink: 0 }}>
          {isConnected ? '● live' : '○ off'}
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <KeyRound size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type={revealed ? 'text' : 'password'}
          className="input-field"
          placeholder={api.envKey}
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{ paddingLeft: 30, paddingRight: 36, fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', padding: '8px 36px 8px 30px' }}
        />
        <button
          onClick={() => setRevealed(r => !r)}
          className="btn btn-ghost"
          style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', padding: '4px 6px', fontSize: '0.7rem' }}
        >
          {revealed ? 'hide' : 'show'}
        </button>
      </div>
    </div>
  );
}

export default function ApiPanel() {
  const [open, setOpen] = useState(false);
  return (
    <section style={{ marginBottom: 28 }}>
      <div className="card card-padded" style={{ padding: open ? 22 : '14px 22px' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Plug size={16} color="var(--text-secondary)" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>API Integrations</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {APIS.length} placeholders · ready when you connect real keys
            </span>
          </div>
          {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </button>

        {open && (
          <div style={{ marginTop: 18 }} className="animate-in">
            <div className="api-grid">
              {APIS.map(api => <ApiCard key={api.id} api={api} />)}
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.5 }}>
              These keys are stored in component state only (demo mode). For production, move them to a <code style={{ background: 'var(--bg-soft)', padding: '1px 5px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace' }}>.env</code> file and read with <code style={{ background: 'var(--bg-soft)', padding: '1px 5px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace' }}>import.meta.env.VITE_*</code>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
