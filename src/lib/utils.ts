export const C = {
  fp:'#e8294a', prm:'#1a6ae0', pld:'#7c3aed',
  green:'#10b981', amber:'#f59e0b', red:'#ef4444',
  text:'#dde1f0', muted:'#5a6185', muted2:'#7a85b0',
  bg1:'#0e1018', bg2:'#141720', bg3:'#1c2030', bg4:'#242840',
  border:'#252a3a', border2:'#2f3550',
} as const;

export const BC: Record<string, string> = {
  FP:'#e8294a', PRM:'#1a6ae0', PLD:'#7c3aed',
};

export function bc(bloque: string): string {
  return BC[bloque] || '#5a6185';
}

export function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export const card: React.CSSProperties = {
  background:'#141720', border:'1px solid #252a3a', borderRadius:'10px', overflow:'hidden',
};
export const hdr: React.CSSProperties = {
  display:'flex', alignItems:'center', justifyContent:'space-between',
  padding:'.55rem .8rem', borderBottom:'1px solid #252a3a', background:'#0e1018',
};
export const ct: React.CSSProperties = {
  fontFamily:'monospace', fontSize:'.63rem', fontWeight:600,
  letterSpacing:'.08em', textTransform:'uppercase', color:'#7a85b0',
};
export const cbadge: React.CSSProperties = {
  fontFamily:'monospace', fontSize:'.58rem', color:'#5a6185',
  background:'#1c2030', border:'1px solid #252a3a', padding:'.06rem .35rem', borderRadius:'3px',
};
export const TH: React.CSSProperties = {
  padding:'.35rem .65rem', textAlign:'left', fontFamily:'monospace', fontSize:'.58rem',
  fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#5a6185',
  borderBottom:'1px solid #252a3a', background:'#0e1018', whiteSpace:'nowrap',
};
export function TD(e?: React.CSSProperties): React.CSSProperties {
  return { padding:'.32rem .65rem', borderBottom:'1px solid #ffffff05', color:'#dde1f0', fontSize:'.74rem', ...e };
}
