import React, { useState, useEffect } from 'react';
import { X, Terminal, CheckCircle2, Clock, Activity, Zap, FileText } from 'lucide-react';

export const AGENT_META = {
  ceo:         { fullName: 'Chief Executive Officer',    initials: 'CE', color: '#7c3aed' },
  cmo:         { fullName: 'Chief Marketing Officer',    initials: 'CM', color: '#db2777' },
  cto:         { fullName: 'Chief Technology Officer',   initials: 'CT', color: '#2563eb' },
  cso:         { fullName: 'Chief Sales Officer',        initials: 'CS', color: '#059669' },
  coo:         { fullName: 'Chief Operating Officer',    initials: 'CO', color: '#ea580c' },
  cfo:         { fullName: 'Chief Financial Officer',    initials: 'CF', color: '#ca8a04' },
  mktHead:     { fullName: 'Head of Marketing — Social', initials: 'MH', color: '#ec4899' },
  contentLead: { fullName: 'Content Strategy Lead',      initials: 'CL', color: '#ec4899' },
  leadDev:     { fullName: 'Lead Developer',             initials: 'LD', color: '#3b82f6' },
  devOps:      { fullName: 'DevOps Engineer',            initials: 'DO', color: '#3b82f6' },
  salesHead:   { fullName: 'Head of Sales',              initials: 'SH', color: '#10b981' },
  prMgr:       { fullName: 'PR & Communications',        initials: 'PR', color: '#10b981' },
  hrHead:      { fullName: 'Head of Human Resources',    initials: 'HR', color: '#f97316' },
  opsHead:     { fullName: 'Head of Operations',         initials: 'OH', color: '#f97316' },
  finHead:     { fullName: 'Head of Finance',            initials: 'FH', color: '#eab308' },
};

export const TERMINAL_ACTIONS = {
  ceo:         ['Synthesizing department intel...', 'Evaluating strategic options...', 'Delegating across C-suite...', 'Monitoring execution progress...', 'All systems nominal.'],
  cmo:         ['Analyzing competitive landscape...', 'Defining ICP and messaging...', 'Setting campaign KPIs...', 'Briefing creative teams...', 'Approving media plan & launching.'],
  cto:         ['Auditing system architecture...', 'Provisioning cloud services...', 'Deploying microservices...', 'Running load & stress tests...', 'Production monitoring active.'],
  cso:         ['Segmenting target accounts...', 'Assigning sales territories...', 'Reviewing opportunity pipeline...', 'Coaching reps on objection handling...', 'Closing enterprise contracts.'],
  coo:         ['Mapping cross-functional workflows...', 'Allocating human resources...', 'Identifying and removing bottlenecks...', 'Synchronizing team sprints...', 'All workstreams on schedule.'],
  cfo:         ['Reviewing budget allocations...', 'Running scenario ROI models...', 'Approving expenditure requests...', 'Generating P&L report...', 'Q3 forecast finalized.'],
  mktHead:     ['Connecting to Instagram Graph API...', 'Pulling profile @ai.w.raj — 48.4K followers, 119 posts...', 'Scraping last 25 reels with view counts and reach multipliers...', 'Computing baseline reach (~18-22K) and viral threshold (40K+)...', 'Identifying winning patterns: "FREE [tool]" + "AI news" + "India-specific"...', 'Flagging underperformers: comment-gating reels at 0.4-0.5x reach...', 'Drafting 30-day content calendar + bio link recommendations...', 'Audit complete — see full report below.'],
  contentLead: ['Brainstorming viral hooks...', 'Writing copy variants for each channel...', 'Scheduling content calendar...', 'Publishing across platforms...', 'Engagement metrics tracked.'],
  leadDev:     ['Cloning feature branch...', 'Building landing page in Next.js...', 'Deploying to Vercel CDN...', 'Running Playwright E2E tests...', 'Production deploy successful.'],
  devOps:      ['Checking CPU and memory metrics...', 'Scaling auto-scaling groups...', 'Configuring load balancers...', 'Setting PagerDuty alerts...', 'Zero downtime — all green.'],
  salesHead:   ['Scraping verified prospect list...', 'Enriching contacts via Clay...', 'Personalizing outreach sequences...', 'Launching email cadence...', '22 discovery calls booked.'],
  prMgr:       ['Drafting embargoed press release...', 'Pitching to TechCrunch & Forbes...', 'Coordinating exec interviews...', 'Monitoring brand sentiment...', 'Feature article confirmed.'],
  hrHead:      ['Auditing available team capacity...', 'Matching skills to workstreams...', 'Scheduling kickoff meetings...', 'Updating Jira sprint boards...', 'Team fully allocated.'],
  opsHead:     ['Auditing current process efficiency...', 'Eliminating redundant handoffs...', 'Streamlining approval pipelines...', 'Retraining teams on new SOPs...', 'Efficiency up 34%.'],
  finHead:     ['Pulling daily spend reports...', 'Reconciling actuals vs. budget...', 'Updating rolling forecast model...', 'Flagging anomalies for CFO review...', 'Finance dashboard live.'],
};

function StatusBadge({ status }) {
  const map = {
    working:   { label: 'Working',   Icon: Activity },
    completed: { label: 'Completed', Icon: CheckCircle2 },
    pending:   { label: 'Pending',   Icon: Clock },
    idle:      { label: 'Idle',      Icon: null },
  };
  const s = map[status] || map.idle;
  return (
    <span className={`badge badge-${status}`}>
      {s.Icon && <s.Icon size={11} />} {s.label}
    </span>
  );
}

function InstagramAuditShowcase() {
  return (
    <div className="showcase">
      <h4 style={{ marginTop: 0 }}>Instagram Audit — @ai.w.raj (Shreyas Raj)</h4>
      <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Live data pulled from profile · 48.4K followers · 119 posts · Verified ✓</p>

      <h4>Top Reels (Most Recent → Oldest)</h4>
      <table>
        <thead><tr><th>#</th><th>Hook</th><th>Views</th><th>Reach×</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>FREE UNLIMITED Claude Opus 4.6 🙈</td><td><strong>355K</strong></td><td><strong>18.2x</strong></td></tr>
          <tr><td>2</td><td>(screen rec — "done completely")</td><td>233K</td><td>—</td></tr>
          <tr><td>3</td><td>HIGGSFIELD IS NOW FREE 🔥</td><td>140K</td><td>9.5x</td></tr>
          <tr><td>4</td><td>(tool demo — "seeing right")</td><td>136K</td><td>7.9x</td></tr>
          <tr><td>5</td><td>AI Agents now get an Indian SIM 🤯</td><td>81.1K</td><td>—</td></tr>
          <tr><td>6</td><td>I'm 17. AI did this for me 🥹</td><td>72.8K</td><td>—</td></tr>
          <tr><td>7</td><td>Claude Mythos Got Leaked 🤯</td><td>49.1K</td><td>3.3x</td></tr>
          <tr><td>8</td><td>Claude Code Leaked 💀</td><td>49.7K</td><td>—</td></tr>
          <tr><td>9</td><td>The art of Claude Code 🤯</td><td>43.4K</td><td>2.6x</td></tr>
          <tr><td>10</td><td>Comment "JJK" To get this 🔴🔵</td><td>12.8K</td><td>0.4x</td></tr>
        </tbody>
      </table>

      <h4>What's Working</h4>
      <p><strong>1. "FREE [paid tool]" format</strong> — your top-performing niche by a mile. Claude Opus 4.6 free → 355K (18.2x). Higgsfield free → 140K (9.5x).</p>
      <p><strong>2. Leak / news format</strong> — Claude Code Leaked → 49.7K. You're effectively a "breaking AI news" channel.</p>
      <p><strong>3. India-specific AI content</strong> — Indian SIM reel hit 81K. Almost zero serious creators in this space.</p>
      <p><strong>4. Age + achievement hooks</strong> — "I'm 17. AI did this for me" → 72.8K.</p>

      <h4>What's Not Working</h4>
      <p><strong>Comment-gating reels</strong> consistently land at 0.4-0.5x reach. Instagram actively suppresses comment-baiting. Cut these or move them to Stories.</p>
      <p><strong>Promotional / masterclass content</strong> always underperforms. Move all selling to Stories and broadcast channel.</p>
      <p><strong>Generic "AI is crazy" hooks</strong> without naming a specific tool — they don't stop the scroll.</p>

      <h4>Profile Audit</h4>
      <p><strong>Bio:</strong> "and 2 more" is a dead-end link — replace with a single Linktree-style page showing all resources.</p>
      <p><strong>Following only 19 accounts</strong> — signals a closed account. Follow 50-100 relevant Indian AI/tech creators and leave 5 genuine comments per day.</p>
      <p><strong>Baseline reach:</strong> 18-22K · <strong>Viral threshold:</strong> 40K+</p>

      <h4>Priority Next Steps</h4>
      <p><strong>This week:</strong> Archive comment-gating reels. Fix bio link. Start following 50-100 relevant accounts.</p>
      <p><strong>Next 30 days:</strong> Set Google Alerts for "Claude free", "Gemini free", "GPT free", "Midjourney free" — post within 24h. Post 1 India-specific AI reel per week. Stop masterclass-promo reels.</p>
      <p><strong>Growth levers:</strong> Collab with 1-2 Indian AI creators (100K-500K). Start a fixed weekly series. Use "48K AI builders" as social proof in bio.</p>

      <p style={{ marginTop: 14, padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 8, color: 'var(--text-primary)' }}>
        <strong>Bottom line:</strong> Your formula — <em>free AI tool drop + Indian context + specific result hook</em> — already prints 355K reels. Lift the floor by killing comment-gating and being first to every "X is now free" announcement.
      </p>
    </div>
  );
}

export default function AgentModal({ agentId, agentData, onClose }) {
  const [actionIndex, setActionIndex] = useState(0);

  useEffect(() => {
    setActionIndex(0);
    if (agentData?.status === 'working') {
      const interval = setInterval(() => {
        setActionIndex(prev => {
          const max = TERMINAL_ACTIONS[agentId]?.length || 5;
          return prev < max - 1 ? prev + 1 : prev;
        });
      }, 950);
      return () => clearInterval(interval);
    } else if (agentData?.status === 'completed') {
      setActionIndex((TERMINAL_ACTIONS[agentId]?.length || 5) - 1);
    }
  }, [agentId, agentData?.status]);

  if (!agentId || !agentData) return null;

  const meta = AGENT_META[agentId] || { fullName: agentId, initials: '??', color: '#7c3aed' };
  const { status, task, output } = agentData;
  const actions = TERMINAL_ACTIONS[agentId] || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div className="agent-avatar" style={{ background: `${meta.color}18`, color: meta.color, width: 48, height: 48, fontSize: '0.95rem' }}>
                {meta.initials}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{meta.fullName}</h2>
                <div style={{ marginTop: 6 }}><StatusBadge status={status} /></div>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: 8 }} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {task && (
            <div>
              <p className="section-eyebrow" style={{ marginBottom: 8 }}>Assigned Objective</p>
              <div style={{ borderLeft: `3px solid ${meta.color}`, background: `${meta.color}08`, borderRadius: '0 8px 8px 0', padding: '12px 16px' }}>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.55 }}>{task}</p>
              </div>
            </div>
          )}

          {(status === 'working' || (status === 'completed' && actions.length)) && (
            <div>
              <p className="section-eyebrow" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Terminal size={11} /> Live Execution
              </p>
              <div className="terminal">
                {actions.slice(0, actionIndex + 1).map((a, i) => (
                  <div key={i} className="terminal-line" style={{ color: i === actionIndex && status === 'working' ? '#fafafa' : '#71717a' }}>
                    <span className="terminal-prompt">›</span>
                    <span>{a}</span>
                    {i === actionIndex && status === 'working' && (
                      <span style={{ display: 'inline-block', width: 7, height: 14, background: '#a78bfa', animation: 'blink 1s step-end infinite' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === 'completed' && agentId === 'mktHead' && (
            <div className="animate-in">
              <p className="section-eyebrow" style={{ marginBottom: 8, color: 'var(--status-completed)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={11} /> Deliverable — Full Audit Report
              </p>
              <InstagramAuditShowcase />
            </div>
          )}

          {output && (
            <div className="animate-in">
              <p className="section-eyebrow" style={{ marginBottom: 8, color: 'var(--status-completed)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={11} /> Final Output
              </p>
              <div style={{ background: 'var(--status-completed-bg)', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ margin: 0, color: '#14532d', lineHeight: 1.55, fontSize: '0.92rem' }}>{output}</p>
              </div>
            </div>
          )}

          {status === 'idle' && !task && (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              <Zap size={28} color={`${meta.color}66`} style={{ marginBottom: 10 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Standing by — awaiting delegation from CEO</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
