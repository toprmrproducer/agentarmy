import React from 'react';
import { Users } from 'lucide-react';
import { AGENT_META } from './AgentModal';

const STATUS_DOT = {
  idle:      '#a1a1aa',
  pending:   '#ea580c',
  working:   '#d97706',
  completed: '#16a34a',
};

export default function FleetOverview({ agents, onSelectAgent }) {
  const ids = Object.keys(AGENT_META);

  return (
    <section style={{ marginBottom: 28 }}>
      <div className="section-head">
        <div className="section-title">
          <Users size={18} color="var(--text-secondary)" />
          The Fleet
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>
            All agents · their tasks · how they're doing
          </span>
        </div>
        <span className="section-eyebrow">{ids.length} agents</span>
      </div>

      <div className="agent-grid">
        {ids.map(id => {
          const meta = AGENT_META[id];
          const data = agents[id] || { status: 'idle' };
          const dotColor = STATUS_DOT[data.status];
          const isWorking = data.status === 'working';

          return (
            <button key={id} className="agent-row" onClick={() => onSelectAgent(id)}>
              <div className="agent-avatar" style={{ background: `${meta.color}15`, color: meta.color }}>
                {meta.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {meta.fullName.replace(/^Chief /, 'C-').replace(/^Head of /, '')}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {data.task || 'Awaiting assignment'}
                </p>
              </div>
              <div
                className={isWorking ? 'dot-working' : ''}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: dotColor, flexShrink: 0,
                }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
