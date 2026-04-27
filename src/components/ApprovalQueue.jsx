import React from 'react';
import { Check, ListChecks } from 'lucide-react';
import { AGENT_META } from './AgentModal';

export default function ApprovalQueue({ tasks, onApprove }) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <section className="card card-padded animate-in" style={{ marginBottom: 22, borderColor: 'var(--accent)', boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.06), var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ListChecks size={18} color="var(--accent)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Pending CEO Approval</div>
            <p style={{ margin: 0, fontSize: '0.78rem' }}>{tasks.length} delegation{tasks.length !== 1 ? 's' : ''} ready to deploy</p>
          </div>
        </div>
        <button onClick={onApprove} className="btn btn-success">
          <Check size={14} /> Approve & Deploy
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map((t, i) => {
          const meta = AGENT_META[t.department] || { initials: '??', color: '#a1a1aa', fullName: t.department };
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              background: 'var(--bg-soft)', borderRadius: 10,
            }}>
              <div className="agent-avatar" style={{ width: 28, height: 28, fontSize: '0.65rem', background: `${meta.color}18`, color: meta.color, borderRadius: 7 }}>
                {meta.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{meta.fullName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
