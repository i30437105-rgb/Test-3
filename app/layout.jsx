export const metadata = {
  title: 'Маркетинг-Аудит | Method Dobrusin',
  description: 'Диагностика бизнеса. 25 вопросов. 3 направления. Точечные рекомендации.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', background: '#0a0a0a', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
