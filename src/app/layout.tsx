import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export const metadata: Metadata = {
  title: 'SIE 2028 — Sistema de Inteligencia Electoral',
  description: 'Fuerza del Pueblo · Campaña 2028',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <main style={{
            flex: 1, overflowY: 'auto', overflowX: 'hidden',
            padding: '1.1rem',
            scrollbarWidth: 'thin',
          }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
