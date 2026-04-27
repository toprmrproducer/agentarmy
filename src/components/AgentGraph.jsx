import React from 'react';

export const NODE_DEFS = {
  ceo:         { id: 'ceo',         label: 'CEO',         sub: 'Chief Executive',           x: 500, y: 320, parent: null,    color: '#7c3aed', r: 36 },
  cmo:         { id: 'cmo',         label: 'CMO',         sub: 'Chief Marketing',           x: 500, y: 142, parent: 'ceo',   color: '#db2777', r: 27 },
  cto:         { id: 'cto',         label: 'CTO',         sub: 'Chief Technology',          x: 690, y: 230, parent: 'ceo',   color: '#2563eb', r: 27 },
  cso:         { id: 'cso',         label: 'CSO',         sub: 'Chief Sales',               x: 690, y: 410, parent: 'ceo',   color: '#059669', r: 27 },
  coo:         { id: 'coo',         label: 'COO',         sub: 'Chief Operating',           x: 310, y: 410, parent: 'ceo',   color: '#ea580c', r: 27 },
  cfo:         { id: 'cfo',         label: 'CFO',         sub: 'Chief Financial',           x: 310, y: 230, parent: 'ceo',   color: '#ca8a04', r: 27 },
  mktHead:     { id: 'mktHead',     label: 'Mkt Head',    sub: 'Head of Marketing',         x: 360, y: 50,  parent: 'cmo',   color: '#ec4899', r: 20 },
  contentLead: { id: 'contentLead', label: 'Content',     sub: 'Content Strategy',          x: 640, y: 50,  parent: 'cmo',   color: '#ec4899', r: 20 },
  leadDev:     { id: 'leadDev',     label: 'Lead Dev',    sub: 'Lead Developer',            x: 870, y: 150, parent: 'cto',   color: '#3b82f6', r: 20 },
  devOps:      { id: 'devOps',      label: 'DevOps',      sub: 'DevOps Engineer',           x: 880, y: 320, parent: 'cto',   color: '#3b82f6', r: 20 },
  salesHead:   { id: 'salesHead',   label: 'Sales Head',  sub: 'Head of Sales',             x: 870, y: 490, parent: 'cso',   color: '#10b981', r: 20 },
  prMgr:       { id: 'prMgr',       label: 'PR Mgr',      sub: 'PR & Comms',                x: 680, y: 580, parent: 'cso',   color: '#10b981', r: 20 },
  hrHead:      { id: 'hrHead',      label: 'HR Head',     sub: 'Head of HR',                x: 320, y: 580, parent: 'coo',   color: '#f97316', r: 20 },
  opsHead:     { id: 'opsHead',     label: 'Ops Head',    sub: 'Head of Operations',        x: 130, y: 490, parent: 'coo',   color: '#f97316', r: 20 },
  finHead:     { id: 'finHead',     label: 'Fin Head',    sub: 'Head of Finance',           x: 120, y: 150, parent: 'cfo',   color: '#eab308', r: 20 },
};

const EDGES = Object.values(NODE_DEFS)
  .filter(n => n.parent)
  .map(n => ({ id: `${n.parent}-${n.id}`, from: NODE_DEFS[n.parent], to: n, color: n.color }));

function EdgeLine({ edge, agentStatus }) {
  const toStatus = agentStatus[edge.to.id]?.status || 'idle';
  const fromStatus = agentStatus[edge.from.id]?.status || 'idle';
  const isActive = toStatus === 'working' || fromStatus === 'working';
  const isDone = toStatus === 'completed' && fromStatus === 'completed';
  const opacity = isDone ? 0.55 : isActive ? 0.85 : 0.18;
  const stroke = (isActive || isDone) ? edge.color : '#a1a1aa';

  return (
    <g>
      <line
        x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y}
        stroke={stroke} strokeWidth={isDone ? 1.6 : 1.1} opacity={opacity}
      />
      {isActive && (
        <line
          x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y}
          stroke={edge.color} strokeWidth={2.2}
          strokeDasharray="6 14"
          opacity={0.85}
          style={{ animation: 'dash-flow 1.2s linear infinite' }}
        />
      )}
    </g>
  );
}

function AgentNode({ node, agentData, selected, onClick }) {
  const status = agentData?.status || 'idle';
  const isWorking  = status === 'working';
  const isDone     = status === 'completed';
  const isPending  = status === 'pending';
  const isSelected = selected;

  const ringColor = isWorking || isPending ? node.color : node.color;
  const fillColor = isDone ? `${node.color}20` : isWorking ? `${node.color}18` : isSelected ? `${node.color}12` : '#ffffff';
  const strokeColor = isSelected ? node.color : isDone ? node.color : isWorking ? node.color : isPending ? '#f97316' : '#e4e4e7';
  const strokeWidth = isSelected ? 2.8 : (isWorking || isDone) ? 2 : 1.4;

  return (
    <g onClick={() => onClick(node.id)} style={{ cursor: 'pointer' }}>
      {(isWorking || isPending) && (
        <circle
          cx={node.x} cy={node.y} r={node.r + 12}
          fill="none" stroke={ringColor} strokeWidth={1.2}
          opacity={0.4}
          style={{ animation: 'node-pulse 2s ease-in-out infinite', transformOrigin: `${node.x}px ${node.y}px` }}
        />
      )}
      <circle
        cx={node.x} cy={node.y} r={node.r}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        style={{ filter: (isWorking || isDone || isSelected) ? `drop-shadow(0 4px 10px ${node.color}40)` : 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))' }}
      />
      <text
        x={node.x} y={node.y + 1}
        textAnchor="middle" dominantBaseline="middle"
        fill={isDone || isWorking || isSelected ? node.color : '#3f3f46'}
        fontSize={node.r > 25 ? 11 : 9}
        fontWeight="700"
        fontFamily="Inter, sans-serif"
        letterSpacing="0.02em"
        style={{ pointerEvents: 'none' }}
      >
        {node.label}
      </text>
      <text
        x={node.x} y={node.y + node.r + 14}
        textAnchor="middle" dominantBaseline="middle"
        fill="#71717a"
        fontSize={8.5}
        fontWeight="500"
        fontFamily="Inter, sans-serif"
        style={{ pointerEvents: 'none' }}
      >
        {node.sub}
      </text>
      {isDone && (
        <g style={{ pointerEvents: 'none' }}>
          <circle cx={node.x + node.r - 5} cy={node.y - node.r + 5} r={6} fill="#16a34a" />
          <path d={`M ${node.x + node.r - 7.5} ${node.y - node.r + 5} L ${node.x + node.r - 5.5} ${node.y - node.r + 7} L ${node.x + node.r - 2.5} ${node.y - node.r + 3}`}
            stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
}

export default function AgentGraph({ agentStatus, selectedId, onSelectNode }) {
  return (
    <div className="agent-graph-container">
      <svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <pattern id="dots-light" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#e4e4e7" />
          </pattern>
        </defs>
        <rect width="1000" height="640" fill="url(#dots-light)" />
        {EDGES.map(edge => <EdgeLine key={edge.id} edge={edge} agentStatus={agentStatus} />)}
        {Object.values(NODE_DEFS).map(node => (
          <AgentNode
            key={node.id}
            node={node}
            agentData={agentStatus[node.id]}
            selected={selectedId === node.id}
            onClick={onSelectNode}
          />
        ))}
      </svg>
    </div>
  );
}
