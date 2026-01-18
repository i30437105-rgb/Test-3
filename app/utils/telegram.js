import { TELEGRAM_CONFIG } from '../data/config';

export async function sendToTelegram(contactData, answers, results) {
  const { name, phone, email } = contactData;
  const sections = ['Стратегия', 'Лидген', 'Продажи'];
  
  let statsText = '';
  let totalGreen = 0;
  let totalRed = 0;
  
  sections.forEach(section => {
    const s = results.sections[section];
    totalGreen += s.totalGreen;
    totalRed += s.totalRed;
    const pct = Math.round((s.totalGreen / s.blocks.length) * 100);
    statsText += `\n📊 ${section}: ${pct}% (✅${s.totalGreen} / ❌${s.totalRed})`;
  });
  
  const totalPercent = Math.round((totalGreen / (totalGreen + totalRed)) * 100);
  
  const redBlocks = [];
  sections.forEach(section => {
    results.sections[section].blocks
      .filter(b => b.status === 'error')
      .forEach(b => redBlocks.push(`• ${b.title} (${section})`));
  });

  const qualAnswers = [];
  if (answers['К1']) qualAnswers.push(`Бизнес: ${answers['К1']}`);
  if (answers['К2']) {
    const probs = Array.isArray(answers['К2']) ? answers['К2'].join(', ') : answers['К2'];
    qualAnswers.push(`Проблемы: ${probs}`);
  }
  if (answers['К3']) qualAnswers.push(`Оборот: ${answers['К3']}`);

  const message = `🎯 *Новый результат аудита!*

👤 *Контакт:*
Имя: ${name || 'Не указано'}
Телефон: ${phone || 'Не указан'}
Email: ${email || 'Не указан'}

📋 *Квалификация:*
${qualAnswers.join('\n')}

📈 *Общий результат: ${totalPercent}%*${statsText}

${redBlocks.length > 0 ? `❌ *Проблемные зоны (${redBlocks.length}):*\n${redBlocks.slice(0, 10).join('\n')}` : '✅ *Все блоки в зелёной зоне!*'}

⏰ ${new Date().toLocaleString('ru-RU')}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error('Telegram error:', error);
  }
}
