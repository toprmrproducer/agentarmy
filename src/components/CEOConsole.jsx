import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const PRESETS = [
  'Launch a viral marketing campaign for our new AI product and generate 500 qualified leads',
  'Audit my Instagram profile @ai.w.raj and produce a 30-day content strategy',
  'Build a landing page and run an outreach sequence to enterprise prospects',
];

export default function CEOConsole({ onAnalyze }) {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const submit = (text) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      onAnalyze(text);
      setIsAnalyzing(false);
      setPrompt('');
    }, 900);
  };

  return (
    <section className="card card-padded" style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={18} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '1rem' }}>CEO Console</div>
          <p style={{ margin: 0, fontSize: '0.82rem' }}>Set a high-level goal — the CEO agent will decompose and delegate it across the fleet.</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submit(prompt); }} style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          className="input-field"
          placeholder="e.g., Audit my Instagram and design a content strategy that triples reach"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isAnalyzing}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" disabled={isAnalyzing || !prompt.trim()} style={{ minWidth: 130 }}>
          {isAnalyzing ? 'Thinking…' : (<><Send size={14} /> Delegate</>)}
        </button>
      </form>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Try:</span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => submit(p)}
            disabled={isAnalyzing}
            className="btn btn-secondary"
            style={{ fontSize: '0.74rem', padding: '5px 10px', fontWeight: 400 }}
          >
            {p.length > 60 ? p.slice(0, 60) + '…' : p}
          </button>
        ))}
      </div>
    </section>
  );
}
