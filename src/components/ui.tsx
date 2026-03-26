import React from 'react';

interface KpiCardProps { label: string; value: string; sub: string; color: string; }

export function KpiCard({ label, value, sub, color }: KpiCardProps) {
  return (
    <div style={{ background:'#141720', border:'1px solid #252a3a', borderRadius:'6px', padding:'.65rem .75rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:color }} />
      <div style={{ fontFamily:'monospace', fontSize:'.56rem', textTransform:'uppercase', letterSpacing:'.1em', color:'#5a6185', marginBottom:'.3rem' }}>{label}</div>
      <div style={{ fontFamily:'monospace', fontSize:'1.25rem', fontWeight:600, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'.62rem', color:'#5a6185', marginTop:'.18rem' }}>{sub}</div>
    </div>
  );
}

interface PageHeaderProps { title: string; tag?: string; backHref?: string; backLabel?: string; children?: React.ReactNode; }

export function PageHeader({ title, tag, backHref, backLabel, children }: PageHeaderProps) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.85rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'.45rem' }}>
        <span style={{ fontSize:'1rem', fontWeight:600 }}>{title}</span>
        {tag && <span style={{ fontFamily:'monospace', fontSize:'.58rem', color:'#5a6185', background:'#1c2030', border:'1px solid #2f3550', padding:'.1rem .35rem', borderRadius:'3px' }}>{tag}</span>}
      </div>
      <div style={{ display:'flex', gap:'.4rem', alignItems:'center' }}>
        {children}
        {backHref && (
          <a href={backHref} style={{ padding:'0 .65rem', height:'26px', background:'#1c2030', border:'1px solid #2f3550', borderRadius:'5px', color:'#7a85b0', fontSize:'.72rem', textDecoration:'none', display:'flex', alignItems:'center' }}>{backLabel || '← Volver'}</a>
        )}
      </div>
    </div>
  );
}

interface BarItemProps { name: string; pct: number; color: string; }
export function BarItem({ name, pct, color }: BarItemProps) {
  return (
    <div style={{ marginBottom:'.55rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.18rem' }}>
        <span style={{ fontSize:'.73rem', fontWeight:500, color }}>{name}</span>
        <span style={{ fontFamily:'monospace', fontSize:'.7rem', color:'#7a85b0' }}>{pct.toFixed(2)}%</span>
      </div>
      <div style={{ height:'5px', background:'#242840', borderRadius:'99px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${Math.min(pct,100)}%`, background:color, borderRadius:'99px' }} />
      </div>
    </div>
  );
}
