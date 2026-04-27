import React, { useState } from 'react';
import { Send, Cpu } from 'lucide-react';

export default function CEOConsole({ onAnalyze }) {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate AI thinking time
    setTimeout(() => {
      onAnalyze(prompt);
      setIsAnalyzing(false);
      setPrompt('');
    }, 1500);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: 'var(--accent-gradient)', padding: '12px', borderRadius: '12px' }}>
          <Cpu size={28} color="white" />
        </div>
        <div>
          <h2 style={{ margin: 0, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CEO Agent Console</h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Enter your high-level business goal and I will delegate it.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="e.g., Launch a marketing campaign for our new AI product and generate leads..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isAnalyzing}
          style={{ flex: 1 }}
        />
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isAnalyzing || !prompt.trim()}
          style={{ minWidth: '120px' }}
        >
          {isAnalyzing ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="working-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>
              Thinking...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={16} /> Delegate
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
