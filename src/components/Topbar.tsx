'use client';
export default function Topbar() {
  return (
    <div style={{ height:'44px', background:'#0e1018', borderBottom:'1px solid #252a3a', display:'flex', alignItems:'center', padding:'0 1rem', gap:'.75rem', flexShrink:0, zIndex:100 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'.45rem' }}>
        <div style={{ width:'22px', height:'22px', background:'#e8294a', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem' }}>⚡</div>
        <span style={{ fontFamily:'monospace', fontSize:'.82rem', fontWeight:600, letterSpacing:'.04em' }}>SIE 2028</span>
        <span style={{ fontFamily:'monospace', fontSize:'.62rem', color:'#e8294a', background:'#e8294a18', border:'1px solid #e8294a30', padding:'.08rem .35rem', borderRadius:'3px' }}>v2.0</span>
      </div>
      <div style={{ width:'1px', height:'18px', background:'#2f3550' }} />
      <span style={{ fontFamily:'monospace', fontSize:'.6rem', padding:'.12rem .4rem', borderRadius:'3px', fontWeight:600, background:'#10b98120', color:'#10b981', border:'1px solid #10b98130' }}>2024 ✓</span>
      <span style={{ fontFamily:'monospace', fontSize:'.6rem', padding:'.12rem .4rem', borderRadius:'3px', fontWeight:600, background:'#f59e0b20', color:'#f59e0b', border:'1px solid #f59e0b30' }}>2020 ✓</span>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.3rem', fontSize:'.68rem', color:'#10b981' }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#10b981' }} />
          Supabase live
        </div>
        <div style={{ width:'1px', height:'18px', background:'#2f3550' }} />
        <span style={{ fontSize:'.72rem', color:'#7a85b0' }}>FP · Campaña 2028</span>
      </div>
    </div>
  );
}
