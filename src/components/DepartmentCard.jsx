import React, { useState, useEffect } from 'react';
import { Briefcase, Activity, CheckCircle, Clock, X, Terminal, Maximize2 } from 'lucide-react';

export default function DepartmentCard({ id, name, icon: Icon, status, task, output }) {
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulated actions for demo purposes
  const actions = {
    marketing: ["Analyzing Instagram engagement metrics...", "Identifying trending audio tracks...", "Generating viral hooks...", "Drafting content calendar...", "Finalizing content strategy..."],
    sales: ["Scraping target leads...", "Verifying email addresses...", "Personalizing outreach templates...", "Sending initial sequence...", "Warming up email domains..."],
    developer: ["Provisioning staging environment...", "Cloning repository...", "Building Next.js frontend...", "Deploying to Vercel...", "Running E2E tests..."],
    operations: ["Checking server load...", "Spinning up read replicas...", "Configuring auto-scaling groups...", "Monitoring system health...", "Optimizing latency..."],
    hr: ["Scanning candidate database...", "Filtering resumes by skills...", "Drafting interview invitations...", "Scheduling calendar events...", "Sending internal memos..."],
    finance: ["Reviewing budget allocation...", "Calculating ROI projections...", "Generating financial report...", "Updating quarterly forecasts...", "Approving transaction batch..."]
  };

  useEffect(() => {
    let interval;
    if (status === 'working') {
      setCurrentActionIndex(0);
      interval = setInterval(() => {
        setCurrentActionIndex((prev) => {
          const maxActions = actions[id] ? actions[id].length : 3;
          return prev < maxActions - 1 ? prev + 1 : prev;
        });
      }, 1000); // Fast actions for cool animation
    }
    return () => clearInterval(interval);
  }, [status, id]);

  const getStatusBadge = () => {
    switch (status) {
      case 'working':
        return <span className="badge badge-working"><Activity size={12} className="mr-1" /> Working</span>;
      case 'completed':
        return <span className="badge badge-completed"><CheckCircle size={12} className="mr-1" /> Completed</span>;
      case 'pending':
        return <span className="badge badge-pending"><Clock size={12} className="mr-1" /> Pending</span>;
      default:
        return <span className="badge badge-idle">Idle</span>;
    }
  };

  return (
    <>
      {/* Small Card */}
      <div 
        className={`glass-panel p-5 flex flex-col gap-4 animate-in ${status === 'working' ? 'working-pulse' : ''}`} 
        style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }}
        onClick={() => setIsExpanded(true)}
      >
        <div style={{ position: 'absolute', top: '12px', right: '12px', opacity: 0.5 }}>
          <Maximize2 size={16} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>
              <Icon size={24} className="text-gradient" />
            </div>
            <h3 style={{ margin: 0 }}>{name}</h3>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {task ? (
            <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task}</p>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, fontSize: '0.9rem' }}>Awaiting instructions...</p>
          )}
        </div>
      </div>

      {/* Expanded Modal Overlay */}
      {isExpanded && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel animate-in" style={{
            width: '90%', maxWidth: '700px', padding: '30px', 
            border: '1px solid var(--accent-primary)',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--accent-gradient)', padding: '12px', borderRadius: '12px' }}>
                  <Icon size={32} color="white" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{name} Agent</h2>
                  <div style={{ marginTop: '4px' }}>{getStatusBadge()}</div>
                </div>
              </div>
              <button onClick={() => setIsExpanded(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px' }}>
                <X size={28} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {task && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Assigned Objective</h4>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid var(--accent-primary)', padding: '16px', borderRadius: '4px 8px 8px 4px' }}>
                    <p style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>{task}</p>
                  </div>
                </div>
              )}

              {status === 'working' && (
                <div>
                   <h4 style={{ fontSize: '0.9rem', color: 'var(--status-working)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={16} /> Live Execution Terminal
                  </h4>
                  <div style={{ background: '#000', border: '1px solid #333', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', minHeight: '150px' }}>
                    {actions[id]?.slice(0, currentActionIndex + 1).map((action, idx) => (
                      <p key={idx} style={{ margin: '0 0 8px 0', color: idx === currentActionIndex ? '#fff' : '#666', fontSize: '0.95rem' }}>
                        <span style={{ color: 'var(--status-completed)', marginRight: '8px' }}>$</span>
                        {action}
                        {idx === currentActionIndex && <span className="working-pulse" style={{ display: 'inline-block', width: '8px', height: '16px', background: '#fff', verticalAlign: 'middle', marginLeft: '4px' }}></span>}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {output && (
                <div className="animate-in">
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--status-completed)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Final Output Data</h4>
                  <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '20px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.6' }}>{output}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
