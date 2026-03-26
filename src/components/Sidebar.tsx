'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { section:'Campaña FP', items:[
    { href:'/dashboard', label:'Dashboard', icon:'◈' },
  ]},
  { section:'Base Electoral', items:[
    { href:'/presidencial', label:'Presidencial', icon:'▣' },
    { href:'/senadores', label:'Senadores', icon:'▢', badge:'32' },
    { href:'/diputados', label:'Diputados', icon:'▦', badge:'32p' },
    { href:'/alcaldes', label:'Alcaldes', icon:'◧', badge:'158' },
    { href:'/historico', label:'Histórico 2020', icon:'◌' },
    { href:'/encuestas', label:'Encuestas', icon:'◑', badge:'6' },
  ]},
  { section:'Próximamente', items:[
    { href:'#', label:'Exterior', icon:'◯', disabled:true },
    { href:'#', label:'Centro de Análisis', icon:'◈', disabled:true },
    { href:'#', label:'Alianzas', icon:'◐', disabled:true },
    { href:'#', label:'Simulador', icon:'⊕', disabled:true },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav style={{ width:'192px', background:'#0e1018', borderRight:'1px solid #252a3a', display:'flex', flexDirection:'column', overflowY:'auto', flexShrink:0, scrollbarWidth:'none' }}>
      {nav.map(g => (
        <div key={g.section}>
          <div style={{ padding:'.9rem .75rem .25rem', fontFamily:'monospace', fontSize:'.56rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'#5a6185' }}>{g.section}</div>
          {g.items.map(item => {
            const disabled = (item as any).disabled;
            const active = !disabled && pathname === item.href || (!disabled && item.href !== '/' && item.href !== '#' && pathname.startsWith(item.href));
            return (
              <Link key={item.href+item.label} href={disabled ? '#' : item.href} style={{
                display:'flex', alignItems:'center', gap:'.45rem', padding:'.3rem .75rem', fontSize:'.76rem',
                color: disabled ? '#5a6185' : active ? '#dde1f0' : '#7a85b0',
                borderLeft:`2px solid ${active ? '#e8294a' : 'transparent'}`,
                background: active ? '#e8294a0a' : 'transparent',
                fontWeight: active ? 500 : 400, textDecoration:'none',
                opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
              }}>
                <span style={{ fontSize:'.8rem', width:'16px', textAlign:'center', opacity:active?1:.7 }}>{item.icon}</span>
                <span style={{ flex:1 }}>{item.label}</span>
                {(item as any).badge && !disabled && (
                  <span style={{ fontFamily:'monospace', fontSize:'.55rem', background:active?'#e8294a':'#242840', border:`1px solid ${active?'#e8294a':'#2f3550'}`, color:active?'#fff':'#7a85b0', padding:'.06rem .3rem', borderRadius:'3px' }}>{(item as any).badge}</span>
                )}
                {disabled && <span style={{ fontFamily:'monospace', fontSize:'.48rem', color:'#5a6185', background:'#1c2030', border:'1px solid #252a3a', padding:'.04rem .25rem', borderRadius:'2px' }}>soon</span>}
              </Link>
            );
          })}
        </div>
      ))}
      <div style={{ marginTop:'auto', padding:'.75rem', borderTop:'1px solid #252a3a' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.35rem', background:'#1c2030', border:'1px solid #2f3550', borderRadius:'5px', padding:'.35rem .55rem', fontSize:'.66rem', color:'#7a85b0' }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#10b981', flexShrink:0 }} />
          DB 2024+2020 activa
        </div>
      </div>
    </nav>
  );
}
