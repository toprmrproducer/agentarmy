import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { AGENT_META } from './AgentModal';

function Item({ id, agent, kind, onClick }) {
  const meta = AGENT_META[id];
  if (!meta) return null;
  return (
    <div className="stream-item" style={{ cursor: 'pointer' }} onClick={() => onClick(id)}>
      <div className="agent-avatar"
        style={{ width: 30, height: 30, fontSize: '0.7rem', background: `${meta.color}15`, color: meta.color, borderRadius: 8 }}>
        {meta.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
          {meta.fullName}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {kind === 'working' ? agent.task : agent.output}
        </div>
      </div>
    </div>
  );
}

export default function TaskStream({ agents, onSelectAgent }) {
  const entries = Object.entries(agents);
  const working   = entries.filter(([, a]) => a.status === 'working');
  const completed = entries.filter(([, a]) => a.status === 'completed');

  return (
    <section style={{ marginBottom: 28 }}>
      <div className="section-head">
        <div className="section-title">Task Stream</div>
        <span className="section-eyebrow">live activity</span>
      </div>

      <div className="stream-grid">
        <div className="stream-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Loader2 size={14} color="var(--status-working)" style={{ animation: 'spin 2s linear infinite' }} />
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>In Progress</span>
            <span className="badge badge-working" style={{ marginLeft: 'auto' }}>{working.length}</span>
          </div>
          {working.length === 0 ? (
            <div className="stream-empty">No active tasks. Submit a goal to begin.</div>
          ) : (
            working.map(([id, agent]) => (
              <Item key={id} id={id} agent={agent} kind="working" onClick={onSelectAgent} />
            ))
          )}
        </div>

        <div className="stream-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <CheckCircle2 size={14} color="var(--status-completed)" />
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Completed</span>
            <span className="badge badge-completed" style={{ marginLeft: 'auto' }}>{completed.length}</span>
          </div>
          {completed.length === 0 ? (
            <div className="stream-empty">Completed deliverables will appear here.</div>
          ) : (
            completed.map(([id, agent]) => (
              <Item key={id} id={id} agent={agent} kind="completed" onClick={onSelectAgent} />
            ))
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
