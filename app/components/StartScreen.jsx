'use client';
import { checkpoints } from '../data/gamification';

export function StartScreen({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666', letterSpacing: '2px', marginBottom: '16px' }}>
          METHOD DOBRUSIN
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>
          Маркетинг-Аудит
        </h1>
        <p style={{ fontSize: '18px', color: '#888', marginBottom: '32px' }}>
          25 вопросов • 3 направления • Точечные рекомендации
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {checkpoints.map((cp, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {cp.icon}
              </div>
              <span style={{ fontSize: '11px', color: '#666' }}>{cp.title}</span>
            </div>
          ))}
        </div>
        <button onClick={onStart} style={{ padding: '18px 48px', fontSize: '16px', fontWeight: 600, background: '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
          Начать аудит →
        </button>
      </div>
    </div>
  );
}
