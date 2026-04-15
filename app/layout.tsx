import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Recoup — AI Revenue Recovery Agent',
  description: 'Recoup is an AI agent that sits on top of your PMS, finds missed revenue opportunities, and surfaces them as one-click approvals. Built for vertical market software companies.',
  keywords: 'hotel revenue management, AI agent, property management, revenue recovery, late fees, pricing optimization',
  openGraph: {
    title: 'Recoup — AI Revenue Recovery Agent',
    description: 'Your PMS sees what happened. Recoup sees what it cost you.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        {children}
      </body>
    </html>
  );
}
