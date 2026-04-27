import React, { useState, useMemo, useEffect } from 'react';
import { Shield, Network, Settings, Sparkles } from 'lucide-react';
import CEOConsole from './components/CEOConsole';
import ApprovalQueue from './components/ApprovalQueue';
import AgentGraph from './components/AgentGraph';
import AgentModal, { AGENT_META } from './components/AgentModal';
import FleetOverview from './components/FleetOverview';
import TaskStream from './components/TaskStream';
import ApiPanel from './components/ApiPanel';
import SetupGuide from './components/SetupGuide';
import OnboardingWizard from './components/OnboardingWizard';
import { isOnboarded, resetOnboarding } from './lib/storage';
import { decomposeGoal, detectActiveProvider } from './lib/agentBrain';

const ALL_IDS = Object.keys(AGENT_META);

const FALLBACK_CSUITE_TASKS = {
  cmo: 'Develop and execute integrated marketing strategy for the campaign.',
  cto: 'Architect scalable infrastructure and ship all technical assets.',
  cso: 'Build enterprise sales pipeline and close key accounts.',
  coo: 'Coordinate cross-functional execution and optimize workflows.',
  cfo: 'Approve budget, manage projections, and track daily spend.',
};

const SUB_TASKS = {
  mktHead:     'Audit @ai.w.raj profile · analyze 25 reels · design 30-day strategy.',
  contentLead: 'Produce viral content and manage the 30-day editorial calendar.',
  leadDev:     'Build landing pages and lead-capture infrastructure.',
  devOps:      'Scale cloud infrastructure to handle 10x traffic spike.',
  salesHead:   'Generate 500 qualified leads and run outreach sequences.',
  prMgr:       'Draft press releases and secure tier-1 media coverage.',
  hrHead:      'Allocate 12 team members across all workstreams.',
  opsHead:     'Streamline workflows and eliminate execution bottlenecks.',
  finHead:     'Track daily spend vs. budget and generate P&L reports.',
};

const OUTPUTS = {
  cmo:         'Marketing strategy live. 4 integrated campaigns running across all channels.',
  cto:         'Infrastructure deployed. 99.98% uptime. p95 latency <120ms.',
  cso:         'Pipeline at $2.4M ARR. 3 enterprise contracts signed this week.',
  coo:         'All 9 workstreams running on schedule. Zero critical blockers.',
  cfo:         '$48K spend approved. ROI projected at 4.2x by end of Q3.',
  mktHead:     'Audit complete: 48.4K followers · baseline 18-22K reach · viral threshold 40K+. Top reel hit 355K (18.2x). 30-day strategy delivered — see report.',
  contentLead: '30-day calendar finalized. 6 viral posts scheduled. Avg engagement +340%.',
  leadDev:     'Landing page live in production. Lighthouse score 96/100.',
  devOps:      'Auto-scaling active. AWS fleet at 10x baseline. All monitors green.',
  salesHead:   '487 qualified leads generated. 22 discovery calls booked this week.',
  prMgr:       'TechCrunch feature secured. 4 podcast appearances confirmed.',
  hrHead:      '12 team members allocated. Jira sprints updated across all squads.',
  opsHead:     'Process efficiency improved by 34%. All SLA targets met.',
  finHead:     'Daily P&L dashboard live. Budget utilization at 82% — on track.',
  ceo:         'Mission accomplished. All 14 reports completed objectives. Campaign launched.',
};

const initAgents = () => ALL_IDS.reduce((acc, id) => ({ ...acc, [id]: { status: 'idle', task: null, output: null } }), {});

export default function App() {
  const [agents, setAgents] = useState(initAgents());
  const [pendingTasks, setPendingTasks] = useState([]);
  const [globalStatus, setGlobalStatus] = useState('Awaiting instructions');
  const [selectedNode, setSelectedNode] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(!isOnboarded());
  const [provider, setProvider] = useState(detectActiveProvider());

  useEffect(() => {
    setProvider(detectActiveProvider());
  }, [showOnboarding]);

  const stats = useMemo(() => {
    const v = Object.values(agents);
    return {
      working:   v.filter(a => a.status === 'working').length,
      completed: v.filter(a => a.status === 'completed').length,
      pending:   v.filter(a => a.status === 'pending').length,
    };
  }, [agents]);

  const handleCEOAnalyze = async (prompt) => {
    setGlobalStatus(provider ? `CEO (${provider}) is decomposing the goal…` : 'CEO synthesizing the strategy…');
    setAgents(prev => ({
      ...prev,
      ceo: { status: 'working', task: `Decomposing: "${prompt}"`, output: null },
    }));

    let csuiteTasks = null;
    if (provider) {
      try {
        const result = await decomposeGoal(prompt);
        if (result.tasks?.length) {
          csuiteTasks = result.tasks
            .filter(t => FALLBACK_CSUITE_TASKS[t.department])
            .map(t => ({ department: t.department, description: t.description }));
        }
      } catch (err) {
        console.error('Brain failed, falling back to simulation:', err);
      }
    }

    if (!csuiteTasks?.length) {
      csuiteTasks = Object.entries(FALLBACK_CSUITE_TASKS).map(([dept, description]) => ({ department: dept, description }));
    }

    setPendingTasks(csuiteTasks);
    setAgents(prev => {
      const next = { ...prev };
      next.ceo = { status: 'working', task: `Delegating goal: "${prompt}"`, output: null };
      csuiteTasks.forEach(t => { next[t.department] = { status: 'pending', task: t.description, output: null }; });
      Object.keys(SUB_TASKS).forEach(id => { next[id] = { status: 'pending', task: SUB_TASKS[id], output: null }; });
      return next;
    });
    setGlobalStatus('Awaiting CEO approval');
  };

  const handleApprove = () => {
    setPendingTasks([]);
    setGlobalStatus('15 agents actively executing…');
    setAgents(prev => {
      const next = { ...prev };
      Object.keys(FALLBACK_CSUITE_TASKS).forEach(id => { if (next[id].status === 'pending') next[id] = { ...next[id], status: 'working' }; });
      return next;
    });
    setTimeout(() => {
      setAgents(prev => {
        const next = { ...prev };
        Object.keys(SUB_TASKS).forEach(id => { if (next[id].status === 'pending') next[id] = { ...next[id], status: 'working' }; });
        return next;
      });
    }, 2000);

    Object.keys(SUB_TASKS).forEach((id, i) => {
      setTimeout(() => setAgents(prev => ({ ...prev, [id]: { ...prev[id], status: 'completed', output: OUTPUTS[id] } })), 7500 + i * 1200);
    });
    Object.keys(FALLBACK_CSUITE_TASKS).forEach((id, i) => {
      setTimeout(() => setAgents(prev => ({ ...prev, [id]: { ...prev[id], status: 'completed', output: OUTPUTS[id] } })), 19000 + i * 1500);
    });
    setTimeout(() => {
      setAgents(prev => ({ ...prev, ceo: { ...prev.ceo, status: 'completed', output: OUTPUTS.ceo } }));
      setGlobalStatus('All 15 agents completed successfully.');
    }, 27500);
  };

  const isAllDone   = globalStatus.includes('completed');
  const isExecuting = globalStatus.includes('executing');
  const dotColor    = isAllDone ? '#16a34a' : isExecuting ? '#d97706' : '#a1a1aa';

  return (
    <div className="container">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="brand-mark"><Shield size={20} color="#fff" /></div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '-0.025em' }}>Agent Army</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Multi-agent orchestration · {ALL_IDS.length} agents
              {provider && <span style={{ color: 'var(--status-completed)', fontWeight: 600 }}> · brain: {provider}</span>}
              {!provider && <span style={{ color: 'var(--text-muted)' }}> · simulation mode</span>}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 14, fontSize: '0.78rem' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Working</span> <strong style={{ color: 'var(--status-working)' }}>{stats.working}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Done</span> <strong style={{ color: 'var(--status-completed)' }}>{stats.completed}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Pending</span> <strong style={{ color: 'var(--status-pending)' }}>{stats.pending}</strong></div>
          </div>
          <div className="status-pill">
            <div className="status-dot" style={{ background: dotColor, boxShadow: `0 0 0 3px ${dotColor}22` }} />
            <span>{globalStatus}</span>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => { resetOnboarding(); setShowOnboarding(true); }}
            style={{ padding: '7px 12px', fontSize: '0.8rem' }}
          >
            <Settings size={13} /> Setup
          </button>
        </div>
      </header>

      <CEOConsole onAnalyze={handleCEOAnalyze} />
      <ApprovalQueue tasks={pendingTasks} onApprove={handleApprove} />

      <FleetOverview agents={agents} onSelectAgent={setSelectedNode} />

      <TaskStream agents={agents} onSelectAgent={setSelectedNode} />

      <section style={{ marginBottom: 28 }}>
        <div className="section-head">
          <div className="section-title">
            <Network size={18} color="var(--text-secondary)" />
            Command Graph
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>
              Click any node to inspect
            </span>
          </div>
          <div className="legend">
            {[
              ['#7c3aed', 'C-Level'], ['#db2777', 'Marketing'], ['#2563eb', 'Tech'],
              ['#059669', 'Sales'], ['#ea580c', 'Ops'], ['#ca8a04', 'Finance'],
            ].map(([c, l]) => (
              <div key={l} className="legend-item">
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <AgentGraph agentStatus={agents} selectedId={selectedNode} onSelectNode={setSelectedNode} />
      </section>

      <SetupGuide />
      <ApiPanel onKeysChanged={() => setProvider(detectActiveProvider())} />

      {selectedNode && (
        <AgentModal agentId={selectedNode} agentData={agents[selectedNode]} onClose={() => setSelectedNode(null)} />
      )}

      {showOnboarding && (
        <OnboardingWizard onClose={() => { setShowOnboarding(false); setProvider(detectActiveProvider()); }} />
      )}
    </div>
  );
}
