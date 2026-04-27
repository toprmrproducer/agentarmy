import React, { useState, useEffect } from 'react';
import CEOConsole from './components/CEOConsole';
import ApprovalQueue from './components/ApprovalQueue';
import DepartmentCard from './components/DepartmentCard';
import { Megaphone, TrendingUp, Users, Settings, DollarSign, Code, Shield } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'marketing', name: 'Marketing', icon: Megaphone },
  { id: 'sales', name: 'Sales', icon: TrendingUp },
  { id: 'hr', name: 'Human Resources', icon: Users },
  { id: 'operations', name: 'Operations', icon: Settings },
  { id: 'finance', name: 'Finance', icon: DollarSign },
  { id: 'developer', name: 'Developer', icon: Code },
];

export default function App() {
  const [agents, setAgents] = useState(
    DEPARTMENTS.reduce((acc, dept) => {
      acc[dept.id] = { status: 'idle', task: null, output: null };
      return acc;
    }, {})
  );
  
  const [pendingTasks, setPendingTasks] = useState([]);
  const [globalStatus, setGlobalStatus] = useState('Awaiting instructions');

  const handleCEOAnalyze = (prompt) => {
    setGlobalStatus('CEO is breaking down the goal...');
    
    // Simulate CEO Agent generating a plan based on the prompt
    // In a real app, this would be an API call to an LLM
    setTimeout(() => {
      const generatedTasks = [
        { department: 'marketing', description: 'Analyze recent viral reels on Instagram and generate 5 new content ideas.' },
        { department: 'sales', description: 'Generate lead list based on the new marketing campaign and draft outreach emails.' },
        { department: 'developer', description: 'Create a landing page placeholder for the incoming traffic.' },
        { department: 'operations', description: 'Ensure server capacity is scaled for the upcoming campaign launch.' },
        { department: 'hr', description: 'Identify internal team members to execute the campaign and manage their workload.' },
        { department: 'finance', description: 'Calculate projected ad spend for the new campaign and adjust monthly budget.' }
      ];
      
      setPendingTasks(generatedTasks);
      
      // Update agent states to pending
      const newAgents = { ...agents };
      generatedTasks.forEach(t => {
        newAgents[t.department] = { ...newAgents[t.department], status: 'pending', task: t.description };
      });
      setAgents(newAgents);
      setGlobalStatus('Pending CEO Approval');
      
    }, 1000);
  };

  const handleApprove = () => {
    setPendingTasks([]);
    setGlobalStatus('Agents are actively executing tasks...');
    
    // Set all pending agents to 'working'
    const workingAgents = { ...agents };
    Object.keys(workingAgents).forEach(dept => {
      if (workingAgents[dept].status === 'pending') {
        workingAgents[dept] = { ...workingAgents[dept], status: 'working' };
      }
    });
    setAgents(workingAgents);

    // Simulate agents finishing their work over time
    const outputs = {
      marketing: "Generated 5 viral content ideas based on recent trends. Sent email back to CEO.",
      sales: "Found 150 target leads. Drafted initial outreach email and started sequence.",
      developer: "Landing page deployed to staging environment with lead capture form.",
      operations: "Scaled AWS instances to handle 10x traffic spike. Monitoring active.",
      hr: "Allocated 3 designers and 2 copywriters for the campaign. Adjusted Jira sprints.",
      finance: "Approved $5,000 ad spend budget. Re-allocated funds from Q3 reserve."
    };

    Object.keys(outputs).forEach((dept, index) => {
      setTimeout(() => {
        setAgents(prev => ({
          ...prev,
          [dept]: { ...prev[dept], status: 'completed', output: outputs[dept] }
        }));
      }, 6000 + (index * 2000)); // Stagger completions, min 6s to show actions
    });
  };

  // Check if all are done
  useEffect(() => {
    const activeAgents = Object.values(agents).filter(a => a.status === 'working' || a.status === 'pending');
    if (activeAgents.length === 0 && globalStatus.includes('executing')) {
      setGlobalStatus('All delegated tasks completed successfully.');
    }
  }, [agents, globalStatus]);

  return (
    <div className="container">
      <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <Shield size={32} color="var(--accent-primary)" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Agent Army Platform</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Multi-Agent Enterprise Orchestration</p>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>System Status:</span> <strong style={{ color: globalStatus.includes('completed') ? 'var(--status-completed)' : 'var(--text-primary)' }}>{globalStatus}</strong>
        </div>
      </header>

      <main>
        <CEOConsole onAnalyze={handleCEOAnalyze} />
        
        <ApprovalQueue tasks={pendingTasks} onApprove={handleApprove} />

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Active Departments
            <span style={{ fontSize: '0.8rem', background: 'var(--bg-card)', padding: '4px 12px', borderRadius: '20px', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              {DEPARTMENTS.length} Agents Online
            </span>
          </h2>
          <div className="grid-departments">
            {DEPARTMENTS.map(dept => (
              <DepartmentCard 
                key={dept.id}
                id={dept.id}
                name={dept.name}
                icon={dept.icon}
                status={agents[dept.id].status}
                task={agents[dept.id].task}
                output={agents[dept.id].output}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
