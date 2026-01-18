'use client';
import { useState } from 'react';

export function ContactScreen({ onSubmit, onSkip }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit({ name, phone, email });
    setIsSubmitting(false);
  };

  const canSubmit = name || phone || email;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🏆</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
          Вы достигли финиша!
        </h1>
        <p style={{ fontSize: '16px', color: '#888', marginBottom: '32px', lineHeight: 1.6 }}>
          Оставьте контакты, чтобы получить персональные рекомендации
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '16px 20px', fontSize: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '100%', padding: '16px 20px', fontSize: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '16px 20px', fontSize: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !canSubmit}
          style={{ width: '100%', padding: '18px 32px', fontSize: '16px', fontWeight: 600, background: (isSubmitting || !canSubmit) ? '#333' : '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', cursor: (isSubmitting || !canSubmit) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: '16px' }}
        >
          {isSubmitting ? 'Отправка...' : 'Получить результаты →'}
        </button>
        <button
          onClick={onSkip}
          style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', padding: '8px' }}
        >
          Пропустить и посмотреть результаты
        </button>
      </div>
    </div>
  );
}
