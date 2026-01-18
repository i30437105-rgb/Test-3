'use client';
import { checkpoints, preCheckpointMessages, motivationalMessages } from '../data/gamification';

export function ProgressBar({ currentQuestion, totalQuestions }) {
  const progress = (currentQuestion / totalQuestions) * 100;
  
  // Границы секций
  const section1End = (11 / 25) * 100; // Стратегия: 1-11
  const section2End = (19 / 25) * 100; // Лидген: 12-19
  
  // Заполнение каждой секции
  const section1Fill = Math.min(progress, section1End);
  const section2Fill = progress > section1End ? Math.min(progress - section1End, section2End - section1End) : 0;
  const section3Fill = progress > section2End ? progress - section2End : 0;

  // Текущий и следующий чекпоинт
  const currentCheckpoint = checkpoints.filter(c => currentQuestion >= c.question).pop();
  const nextCheckpoint = checkpoints.find(c => c.question > currentQuestion);
  const questionsToNext = nextCheckpoint ? nextCheckpoint.question - currentQuestion : 0;

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Прогресс-бар с тремя секциями */}
      <div style={{ position: 'relative', height: '12px', background: '#1a1a1a', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
        {/* Зелёная секция */}
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${section1Fill}%`,
          background: '#22c55e',
          transition: 'width 0.3s ease'
        }} />
        {/* Жёлтая секция */}
        <div style={{
          position: 'absolute', left: `${section1End}%`, top: 0, height: '100%',
          width: `${section2Fill}%`,
          background: '#eab308',
          transition: 'width 0.3s ease'
        }} />
        {/* Красная секция */}
        <div style={{
          position: 'absolute', left: `${section2End}%`, top: 0, height: '100%',
          width: `${section3Fill}%`,
          background: '#ef4444',
          transition: 'width 0.3s ease'
        }} />
        {/* Разделители */}
        <div style={{ position: 'absolute', left: `${section1End}%`, top: 0, bottom: 0, width: '2px', background: '#333', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `${section2End}%`, top: 0, bottom: 0, width: '2px', background: '#333', zIndex: 2 }} />
      </div>

      {/* Строка 1: процент и номер вопроса */}
      <div style={{ fontSize: '13px', color: '#888', textAlign: 'left', marginBottom: '4px' }}>
        <span style={{ color: '#fff', fontWeight: 600 }}>{Math.round(progress)}%</span> пройдено • Вопрос {currentQuestion} из {totalQuestions}
      </div>

      {/* Строка 2: текущий уровень и до следующего рубежа */}
      {currentCheckpoint && (
        <div style={{ fontSize: '13px', color: '#888', textAlign: 'left' }}>
          Текущий уровень: <span style={{ color: '#22c55e' }}>{currentCheckpoint.title}</span>
          {nextCheckpoint && (
            <span>, до рубежа <span style={{ color: '#fff' }}>{nextCheckpoint.title}</span>: {questionsToNext} {questionsToNext === 1 ? 'вопрос' : questionsToNext < 5 ? 'вопроса' : 'вопросов'}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function MotivationalMessage({ questionNumber }) {
  const preCheckpoint = preCheckpointMessages[questionNumber];
  const motivational = motivationalMessages[questionNumber];
  const message = preCheckpoint || motivational;
  
  if (!message) return null;
  
  const isPreCheckpoint = !!preCheckpoint;
  
  return (
    <div style={{
      padding: '16px 20px',
      background: isPreCheckpoint ? 'rgba(234, 179, 8, 0.1)' : 'rgba(66, 153, 225, 0.1)',
      border: `1px solid ${isPreCheckpoint ? 'rgba(234, 179, 8, 0.3)' : 'rgba(66, 153, 225, 0.3)'}`,
      borderRadius: '12px',
      marginBottom: '24px',
      fontSize: '14px',
      lineHeight: 1.6,
      color: isPreCheckpoint ? '#eab308' : '#4299e1'
    }}>
      {isPreCheckpoint ? '🎯 ' : '💪 '}{message}
    </div>
  );
}

export function CheckpointMessage({ checkpoint }) {
  return (
    <div style={{
      padding: '16px 20px',
      background: 'rgba(34, 197, 94, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      borderRadius: '12px',
      marginBottom: '24px',
      fontSize: '14px',
      lineHeight: 1.6,
      color: '#22c55e'
    }}>
      🏆 Рубеж достигнут: <strong>{checkpoint.title}</strong>!
    </div>
  );
}
