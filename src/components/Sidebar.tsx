'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { section: 'Campaña FP', items: [
    { href: '/dashboard', label: 'Dashboard', icon: '◈' },
    { href: '/proyeccion', label: 'Proyección 2028', icon: '◎', disabled: true },
  ]},
  { section: 'Base Electoral', items: [
    { href: '/presidencial', label: 'Presidencial', icon: '▣' },
    { href: '/senadores', label: 'Senadores', icon: '▢', badge: '32' },
    { href: '/diputados', label: 'Diputados', icon: '▦', badge: '178', disabled: true },
    { href: '/alcaldes', label: 'Alcaldes', icon: '◧', badge: '158', disabled: true },
    { href: '/exterior', label: 'Exterior', icon: '◯', disabled: true },
    { href: '/historico', label: 'Histórico 2020', icon: '◌', disabled: true },
  ]},
  { section: 'Inteligencia FP', items: [
    { href: '/analisis', label: 'Centro de Análisis', icon: '◈', disabled: true },
    { href: '/alianzas', label: 'Alianzas', icon: '◐', disabled: true },
    { href: '/encuestas', label: 'Encuestas', icon: '◑', badge: '6', disabled: true },
    { href: '/simulador', label: 'Simulador', icon: '⊕', disabled: true },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav style={{
      width: '192px', background: 'var(--bg1)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0
    }}>
      {navItems.map(group => (
        <div key={group.section}>
          <div style={{
            padding: '.9rem .75rem .25rem', fontFamily: 'monospace', fontSize: '.56rem',
            fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)'
          }}>{group.section}</div>
          {group.items.map(item => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.45rem',
                  padding: '.3rem .75rem', fontSize: '.76rem',
                  color: item.disabled ? 'var(--muted)' : active ? 'var(--text)' : 'var(--muted2)',
                  borderLeft: `2px solid ${active ? 'var(--fp)' : 'transparent'}`,
                  background: active ? '#e8294a0a' : 'transparent',
                  fontWeight: active ? 500 : 400,
                  textDecoration: 'none',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.5 : 1,
                  transition: 'all .12s',
                }}
              >
                <span style={{ fontSize: '.8rem', width: '16px', textAlign: 'center', opacity: active ? 1 : 0.7 }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontFamily: 'monospace', fontSize: '.55rem',
                    background: active ? 'var(--fp)' : 'var(--bg4)',
                    border: `1px solid ${active ? 'var(--fp)' : 'var(--border2)'}`,
                    color: active ? '#fff' : 'var(--muted2)',
                    padding: '.06rem .3rem', borderRadius: '3px'
                  }}>{item.badge}</span>
                )}
                {item.disabled && (
                  <span style={{
                    fontFamily: 'monospace', fontSize: '.48rem', color: 'var(--muted)',
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    padding: '.04rem .25rem', borderRadius: '2px'
                  }}>PRONTO</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
      <div style={{ marginTop: 'auto', padding: '.75rem', borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '.35rem',
          background: 'var(--bg3)', border: '1px solid var(--border2)',
          borderRadius: '5px', padding: '.35rem .55rem', fontSize: '.66rem', color: 'var(--muted2)'
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)' }}></div>
          DB 2024+2020 activa
        </div>
      </div>
    </nav>
  );
}
