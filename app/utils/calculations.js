export function calculateResults(answers, questions) {
  const sectionNames = ['Стратегия', 'Лидген', 'Продажи'];
  const results = {};

  sectionNames.forEach(section => {
    const sectionQuestions = questions.filter(q => q.section === section && !q.isQualification);
    const levels = [...new Set(sectionQuestions.map(q => q.level))].sort((a, b) => a - b);
    
    results[section] = {
      blocks: sectionQuestions.map(q => ({
        ...q,
        answer: answers[q.id] ?? null,
        status: answers[q.id] === true ? 'success' : answers[q.id] === false ? 'error' : 'pending'
      })).sort((a, b) => a.level - b.level),
      levels,
      totalGreen: sectionQuestions.filter(q => answers[q.id] === true).length,
      totalRed: sectionQuestions.filter(q => answers[q.id] === false).length,
      total: sectionQuestions.length
    };
  });

  // Находим первый красный блок (самая нижняя проблема)
  let firstRedBlock = null;
  for (const section of sectionNames) {
    const redBlock = results[section].blocks.find(b => b.status === 'error');
    if (redBlock && (!firstRedBlock || redBlock.level < firstRedBlock.level)) {
      firstRedBlock = redBlock;
    }
  }

  return { sections: results, firstRedBlock };
}
