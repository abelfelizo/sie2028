import React from 'react';

export function KpiCard({ label, value, sub, color }: { label:string; value:string; sub:string; color:string }) {
  return (
    <div style={{ background:'#141720', border:'1px solid #252a3a', borderRadius:'6px', padding:'.65rem .75rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:color }} />
      <div style={{ fontFamily:'monospace', fontSize:'.56rem', textTransform:'uppercase', letterSpacing:'.1em', color:'#5a6185', marginBottom:'.3rem' }}>{label}</div>
      <div style={{ fontFamily:'monospace', fontSize:'1.25rem', fontWeight:600, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'.62rem', color:'#5a6185', marginTop:'.18rem' }}>{sub}</div>
    </div>
  );
}

export function Bar({ pct, color, label, val }: { pct:number; color:string; label:string; val:string }) {
  return (
    <div style={{ marginBottom:'.55rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.18rem' }}>
        <span style={{ fontSize:'.73rem', fontWeight:500, color }}>{label}</span>
        <span style={{ fontFamily:'monospace', fontSize:'.7rem', color:'#7a85b0' }}>{val}</span>
      </div>
      <div style={{ height:'5px', background:'#242840', borderRadius:'99px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${Math.min(pct,100)}%`, background:color, borderRadius:'99px' }} />
      </div>
    </div>
  );
}

export function BloqueBadge({ bloque }: { bloque:string }) {
  const colors: Record<string,{bg:string,color:string,border:string}> = {
    PRM:{ bg:'#1a6ae018', color:'#1a6ae0', border:'1px solid #1a6ae030' },
    FP:{ bg:'#e8294a18', color:'#e8294a', border:'1px solid #e8294a30' },
    PLD:{ bg:'#7c3aed18', color:'#7c3aed', border:'1px solid #7c3aed30' },
  };
  const s = colors[bloque] || { bg:'#5a618518', color:'#5a6185', border:'1px solid #5a618530' };
  return (
    <span style={{ fontFamily:'monospace', fontSize:'.6rem', fontWeight:600, padding:'.08rem .35rem', borderRadius:'3px', background:s.bg, color:s.color, border:s.border }}>{bloque}</span>
  );
}
