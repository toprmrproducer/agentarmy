import React from 'react';
import { Check, Clock } from 'lucide-react';

export default function ApprovalQueue({ tasks, onApprove }) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="glass-panel animate-in" style={{ padding: '24px', marginBottom: '24px', borderLeft: '4px solid var(--status-pending)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="var(--status-pending)" />
          <h3 style={{ margin: 0 }}>Pending Approval</h3>
        </div>
        <span className="badge badge-pending">{tasks.length} tasks generated</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {tasks.map((task, idx) => (
          <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--bg-card)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-primary)', minWidth: '80px', textAlign: 'center' }}>
              {task.department}
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{task.description}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onApprove} className="btn btn-primary" style={{ background: 'var(--status-completed)', color: '#000', boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)' }}>
          <Check size={18} /> Approve & Deploy Agents
        </button>
      </div>
    </div>
  );
}
