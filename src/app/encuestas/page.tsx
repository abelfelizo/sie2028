import { supabase } from '@/lib/supabase';
import { C } from '@/lib/utils';
import { KpiCard } from '@/components/ui';
import Link from 'next/link';
export const revalidate = 3600;

export default async function EncuestasPage() {
  const { data: encuestas } = await supabase.from('sie_encuestas').select('*').order('fecha',{ascending:true});
  const all = encuestas || [];
  const ultima = all[all.length-1];
  const penultima = all[all.length-2];
  const fpTrend = ultima&&penultima ? Number(ultima.fp_pct)-Number(penultima.fp_pct) : 0;
  const prmTrend = ultima&&penultima ? Number(ultima.prm_pct)-Number(penultima.prm_pct) : 0;
  const intencion = all.filter((e:any)=>e.tipo==='intencion_candidato');
  const simpatia = all.filter((e:any)=>e.tipo==='simpatia_partidaria');

  // SVG chart
  const W=500,H=130,PL=30,PR=10,PT=12,PB=22;
  const vals=all.map((e:any)=>({fp:Number(e.fp_pct),prm:Number(e.prm_pct),pld:Number(e.pld_pct)}));
  const allV=vals.flatMap(v=>[v.fp,v.prm,v.pld]).filter(v=>v>0);
  const minV=allV.length?Math.floor(Math.min(...allV)-3):0;
  const maxV=allV.length?Math.ceil(Math.max(...allV)+3):60;
  const xStep=all.length>1?(W-PL-PR)/(all.length-1):0;
  const yS=(v:number)=>PT+(H-PT-PB)*(1-(v-minV)/(maxV-minV));
  const xAt=(i:number)=>PL+i*xStep;
  const poly=(k:'fp'|'prm'|'pld')=>vals.map((v,i)=>`${xAt(i).toFixed(1)},${yS(v[k]).toFixed(1)}`).join(' ');

  const s={background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'} as const;
  const h={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1} as const;
  const th={padding:'.35rem .65rem',textAlign:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' as const,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap' as const};
  const td=(e?:any)=>({padding:'.35rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',...e});
  const qC=(c:string)=>c?.trim()==='A'?{color:'#10b981',bg:'#10b98118',border:'1px solid #10b98130'}:{color:'#f59e0b',bg:'#f59e0b18',border:'1px solid #f59e0b30'};
  const tl=(t:string)=>t==='intencion_candidato'?'Intención':'Simpatía';

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Encuestas</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>{all.length} REGISTROS</span>
        </div>
        <Link href="/dashboard" style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center'}}>← Dashboard</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="Última FP" value={`${Number(ultima?.fp_pct||0).toFixed(1)}%`} sub={`${fpTrend>=0?'+':''}${fpTrend.toFixed(1)}pp vs anterior`} color={C.fp}/>
        <KpiCard label="Última PRM" value={`${Number(ultima?.prm_pct||0).toFixed(1)}%`} sub={`${prmTrend>=0?'+':''}${prmTrend.toFixed(1)}pp vs anterior`} color={C.prm}/>
        <KpiCard label="Intención candidato" value={`${intencion.length}`} sub="Registros" color={C.amber}/>
        <KpiCard label="Simpatía partidaria" value={`${simpatia.length}`} sub="Registros" color={C.muted2}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.6rem',marginBottom:'.6rem'}}>
        {/* Tabla */}
        <div style={s}>
          <div style={h}><span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Registro completo</span><span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>Ene–Mar 2026</span></div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
            <thead><tr>
              <th style={th}>Fecha</th><th style={th}>Firma</th><th style={th}>Tipo</th>
              <th style={{...th,textAlign:'right'}}>PRM</th><th style={{...th,textAlign:'right'}}>FP</th>
              <th style={{...th,textAlign:'right'}}>PLD</th><th style={{...th,textAlign:'center'}}>Cal.</th>
            </tr></thead>
            <tbody>
              {[...all].reverse().map((e:any)=>{
                const q=qC(e.calidad);
                return(
                  <tr key={e.id}>
                    <td style={td({fontFamily:'monospace',fontSize:'.7rem',color:C.muted2})}>{e.fecha}</td>
                    <td style={td({fontWeight:500})}>{e.firma}</td>
                    <td style={td({fontSize:'.68rem',color:C.muted2})}>{tl(e.tipo)}</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:C.prm,fontWeight:600})}>{Number(e.prm_pct).toFixed(1)}%</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{Number(e.fp_pct).toFixed(1)}%</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:C.pld})}>{Number(e.pld_pct).toFixed(1)}%</td>
                    <td style={td({textAlign:'center'})}><span style={{fontFamily:'monospace',fontSize:'.6rem',fontWeight:700,padding:'.08rem .3rem',borderRadius:'3px',background:q.bg,color:q.color,border:q.border}}>{e.calidad?.trim()}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Gráfico */}
        <div style={s}>
          <div style={h}><span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Tendencia FP vs PRM</span><span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>Ene–Mar 2026</span></div>
          <div style={{padding:'.75rem'}}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto'}}>
              {[minV,Math.round((minV+maxV)/2),maxV].map(v=>(
                <g key={v}>
                  <line x1={PL} y1={yS(v)} x2={W-PR} y2={yS(v)} stroke="#252a3a" strokeWidth="0.5" strokeDasharray="3,3"/>
                  <text x={PL-3} y={yS(v)} textAnchor="end" dominantBaseline="middle" fill="#5a6185" fontSize="8" fontFamily="monospace">{v}%</text>
                </g>
              ))}
              <line x1={PL} y1={PT} x2={PL} y2={H-PB} stroke="#2f3550" strokeWidth="0.5"/>
              <line x1={PL} y1={H-PB} x2={W-PR} y2={H-PB} stroke="#2f3550" strokeWidth="0.5"/>
              <polyline points={poly('prm')} fill="none" stroke={C.prm} strokeWidth="1.5" strokeLinejoin="round"/>
              <polyline points={poly('fp')} fill="none" stroke={C.fp} strokeWidth="2" strokeLinejoin="round"/>
              <polyline points={poly('pld')} fill="none" stroke={C.pld} strokeWidth="1" strokeLinejoin="round" strokeDasharray="4,2"/>
              {vals.map((v,i)=><circle key={`fp${i}`} cx={xAt(i)} cy={yS(v.fp)} r="3" fill={C.fp}/>)}
              {vals.map((v,i)=><circle key={`prm${i}`} cx={xAt(i)} cy={yS(v.prm)} r="3" fill={C.prm}/>)}
              {vals.length>0&&(<>
                <text x={xAt(vals.length-1)+5} y={yS(vals[vals.length-1].prm)} dominantBaseline="middle" fill={C.prm} fontSize="8" fontFamily="monospace">PRM</text>
                <text x={xAt(vals.length-1)+5} y={yS(vals[vals.length-1].fp)} dominantBaseline="middle" fill={C.fp} fontSize="8" fontFamily="monospace">FP</text>
              </>)}
              {all.map((e:any,i:number)=>(
                <text key={i} x={xAt(i)} y={H-4} textAnchor="middle" fill="#5a6185" fontSize="7" fontFamily="monospace">{e.fecha?.slice(5)}</text>
              ))}
            </svg>
            <div style={{display:'flex',gap:'1rem',marginTop:'.5rem',fontSize:'.68rem',justifyContent:'center'}}>
              {[{label:'PRM',color:C.prm},{label:'FP',color:C.fp},{label:'PLD (---)',color:C.pld}].map(l=>(
                <span key={l.label} style={{display:'flex',alignItems:'center',gap:'.3rem'}}>
                  <span style={{display:'inline-block',width:'14px',height:'2px',background:l.color,borderRadius:'1px'}}/>
                  <span style={{color:l.color}}>{l.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Cards individuales */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.5rem'}}>
        {[...all].reverse().map((e:any)=>{
          const fp_=Number(e.fp_pct),prm_=Number(e.prm_pct),pld_=Number(e.pld_pct);
          const total=fp_+prm_+pld_||1;
          const q=qC(e.calidad);
          return(
            <div key={e.id} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'8px',padding:'.65rem .75rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.2rem'}}>
                <span style={{fontWeight:600,fontSize:'.82rem'}}>{e.firma}</span>
                <span style={{fontFamily:'monospace',fontSize:'.58rem',fontWeight:700,padding:'.06rem .3rem',borderRadius:'3px',background:q.bg,color:q.color,border:q.border}}>{e.calidad?.trim()}</span>
              </div>
              <div style={{fontSize:'.63rem',color:C.muted,marginBottom:'.4rem'}}>{e.fecha} · {tl(e.tipo)} · N={Number(e.n_muestra).toLocaleString()}</div>
              <div style={{display:'flex',height:'5px',borderRadius:'3px',overflow:'hidden',marginBottom:'.4rem',gap:'1px'}}>
                <div style={{flex:prm_/total,background:C.prm}}/><div style={{flex:fp_/total,background:C.fp}}/><div style={{flex:pld_/total,background:C.pld}}/>
              </div>
              <div style={{display:'flex',gap:'.6rem',fontFamily:'monospace',fontSize:'.65rem'}}>
                <span style={{color:C.prm,fontWeight:600}}>PRM {prm_.toFixed(1)}%</span>
                <span style={{color:C.fp,fontWeight:600}}>FP {fp_.toFixed(1)}%</span>
                <span style={{color:C.pld}}>PLD {pld_.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
