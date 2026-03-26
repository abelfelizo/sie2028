'use client';

export default function Topbar() {
  return (
    <div style={{
      height: '44px', background: 'var(--bg1)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '.75rem',
      flexShrink: 0, position: 'relative', zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', textDecoration: 'none' }}>
        <div style={{
          width: '22px', height: '22px', background: 'var(--fp)', borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem'
        }}>⚡</div>
        <span style={{ fontFamily: 'monospace', fontSize: '.82rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '.04em' }}>
          SIE 2028
        </span>
        <span style={{
          fontFamily: 'monospace', fontSize: '.62rem', color: 'var(--fp)',
          background: '#e8294a18', border: '1px solid #e8294a30',
          padding: '.08rem .35rem', borderRadius: '3px'
        }}>v2.0</span>
      </div>

      <div style={{ width: '1px', height: '18px', background: 'var(--border2)' }}></div>

      <span style={{
        fontFamily: 'monospace', fontSize: '.6rem', padding: '.12rem .4rem', borderRadius: '3px',
        fontWeight: 600, background: '#10b98120', color: '#10b981', border: '1px solid #10b98130'
      }}>2024 ✓</span>
      <span style={{
        fontFamily: 'monospace', fontSize: '.6rem', padding: '.12rem .4rem', borderRadius: '3px',
        fontWeight: 600, background: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b30'
      }}>2020 ✓</span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.68rem', color: 'var(--green)' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)' }}></div>
          Supabase conectado
        </div>
        <div style={{ width: '1px', height: '18px', background: 'var(--border2)' }}></div>
        <span style={{ fontSize: '.72rem', color: 'var(--muted2)' }}>FP · Campaña 2028</span>
      </div>
    </div>
  );
}
