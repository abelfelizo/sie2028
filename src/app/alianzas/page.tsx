import{supabase}from'@/lib/supabase';
import{C,fmt}from'@/lib/utils';
import{KpiCard,Badge}from'@/components/ui';
import Link from'next/link';
export const revalidate=3600;
export default async function Page(){
  const{data}=await supabase.from('sie_motor_alianza').select('*').order('provincia',{ascending:true});
  const rows=data??[];
  const gana30=rows.filter((r:any)=>r.ganador_alianza_80==='FP').length;
  const gana50=rows.filter((r:any)=>r.ganador_alianza_50==='FP').length;
  const actual=rows.filter((r:any)=>r.ganador_actual==='FP').length;
  const totFp=rows.reduce((a:number,r:any)=>a+Number(r.fp),0);
  const totPld=rows.reduce((a:number,r:any)=>a+Number(r.pld),0);
  const totPrm=rows.reduce((a:number,r:any)=>a+Number(r.prm),0);
  const totVal=rows.reduce((a:number,r:any)=>a+Number(r.validos),0)||1;
  const ali50Pct=(totFp+totPld*0.5)/totVal*100;
  const ali80Pct=(totFp+totPld*0.8)/totVal*100;
  const td=(e?:any)=>({padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',...e});
  const thS={padding:'.35rem .65rem',textAlign:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' as const,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap' as const};
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Alianzas FP + PLD</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>SIMULACIÓN PRESIDENCIAL 2028</span>
        </div>
        <Link href="/simulador" style={{padding:'0 .65rem',height:'26px',background:C.fp,borderRadius:'5px',color:'#fff',fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center',fontWeight:500}}>Simulador →</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="FP gana hoy" value={`${actual}/32`} sub="Sin alianza" color={C.fp}/>
        <KpiCard label="FP + 50% PLD" value={`${gana50}/32`} sub="Escenario realista" color={C.amber}/>
        <KpiCard label="FP + 80% PLD" value={`${gana30}/32`} sub="Escenario optimista" color={C.green}/>
        <KpiCard label="FP nac. + 50% PLD" value={`${ali50Pct.toFixed(1)}%`} sub={`vs PRM ${(totPrm/totVal*100).toFixed(1)}%`} color={C.fp}/>
        <KpiCard label="FP nac. + 80% PLD" value={`${ali80Pct.toFixed(1)}%`} sub="Escenario optimista" color={C.green}/>
      </div>

      {/* Barra comparativa */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden',marginBottom:'.6rem'}}>
        <div style={{padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1,fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Distribución nacional por escenario</div>
        <div style={{padding:'.75rem'}}>
          {[
            {label:'Sin alianza — FP solo',fp:totFp/totVal*100,prm:totPrm/totVal*100},
            {label:'Alianza 30% PLD→FP'  ,fp:(totFp+totPld*0.3)/totVal*100,prm:totPrm/totVal*100},
            {label:'Alianza 50% PLD→FP'  ,fp:(totFp+totPld*0.5)/totVal*100,prm:totPrm/totVal*100},
            {label:'Alianza 80% PLD→FP'  ,fp:(totFp+totPld*0.8)/totVal*100,prm:totPrm/totVal*100},
          ].map(s=>(
            <div key={s.label} style={{marginBottom:'.7rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.2rem',fontSize:'.72rem'}}>
                <span style={{color:C.muted2}}>{s.label}</span>
                <span style={{fontFamily:'monospace'}}>
                  <span style={{color:C.fp,fontWeight:600}}>{s.fp.toFixed(1)}%</span>
                  <span style={{color:C.muted,margin:'0 .4rem'}}>vs</span>
                  <span style={{color:C.prm}}>{s.prm.toFixed(1)}%</span>
                  <span style={{color:s.fp>s.prm?C.green:C.red,marginLeft:'.4rem',fontSize:'.68rem'}}>
                    {s.fp>s.prm?'▲ FP GANA':'▼ PRM GANA'}
                  </span>
                </span>
              </div>
              <div style={{height:'8px',background:C.bg4,borderRadius:'4px',overflow:'hidden',display:'flex'}}>
                <div style={{flex:s.fp,background:C.fp}}/>
                <div style={{flex:s.prm,background:C.prm}}/>
                <div style={{flex:Math.max(0,100-s.fp-s.prm),background:C.bg3}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla por provincia */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
          <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Resultado por provincia — 3 escenarios</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>{rows.length} provincias</span>
        </div>
        <div style={{maxHeight:'460px',overflowY:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
            <thead><tr>
              <th style={thS}>Provincia</th>
              <th style={{...thS,textAlign:'right'}}>FP solo</th>
              <th style={{...thS,textAlign:'right'}}>PLD %</th>
              <th style={{...thS,textAlign:'right'}}>Ali. 30%</th>
              <th style={{...thS,textAlign:'right'}}>Ali. 50%</th>
              <th style={{...thS,textAlign:'right'}}>Ali. 80%</th>
              <th style={{...thS,textAlign:'center'}}>Hoy</th>
              <th style={{...thS,textAlign:'center'}}>50%</th>
              <th style={{...thS,textAlign:'center'}}>80%</th>
            </tr></thead>
            <tbody>
              {rows.map((r:any)=>(
                <tr key={r.provincia_id}>
                  <td style={td({fontWeight:500})}>{r.provincia}</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{Number(r.fp_pct).toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.pld})}>{Number(r.pld_pct).toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace'})}>{Number(r.alianza_30_pct).toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:Number(r.alianza_50_pct)>Number(r.prm_pct)?C.green:C.text,fontWeight:600})}>{Number(r.alianza_50_pct).toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:Number(r.alianza_80_pct)>Number(r.prm_pct)?C.green:C.text})}>{Number(r.alianza_80_pct).toFixed(1)}%</td>
                  <td style={td({textAlign:'center'})}><Badge bloque={r.ganador_actual}/></td>
                  <td style={td({textAlign:'center'})}><Badge bloque={r.ganador_alianza_50}/></td>
                  <td style={td({textAlign:'center'})}><Badge bloque={r.ganador_alianza_80}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
