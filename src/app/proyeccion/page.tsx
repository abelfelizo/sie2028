import{supabase}from'@/lib/supabase';
import{C,fmt,S,td,bc}from'@/lib/utils';
import{KpiCard,Bar}from'@/components/ui';
import Link from'next/link';
export const revalidate=3600;
export default async function Page(){
  const[{data:py},{data:enc}]=await Promise.all([
    supabase.from('sie_motor_proyeccion').select('*').single(),
    supabase.from('sie_encuestas').select('*').order('fecha',{ascending:true}),
  ]);
  const p=py as any;
  if(!p) return <div style={{padding:'2rem',color:'#5a6185'}}>Cargando datos...</div>;
  const fpP=Number(p.fp_proyectado_pct)||0;
  const prmP=Number(p.prm_proyectado_pct)||0;
  const gana=fpP>prmP;
  const W=500,H=130,PL=30,PR=30,PT=12,PB=22;
  const all=(enc||[]) as any[];
  const vals=all.map((e:any)=>({fp:Number(e.fp_pct),prm:Number(e.prm_pct),pld:Number(e.pld_pct)}));
  const allV=vals.flatMap(v=>[v.fp,v.prm]).filter(v=>v>0);
  const minV=allV.length?Math.floor(Math.min(...allV)-3):0;
  const maxV=allV.length?Math.ceil(Math.max(...allV)+3):60;
  const xStep=all.length>1?(W-PL-PR)/(all.length-1):0;
  const yS=(v:number)=>PT+(H-PT-PB)*(1-(v-minV)/(maxV-minV));
  const xAt=(i:number)=>PL+i*xStep;
  const poly=(k:'fp'|'prm')=>vals.map((v,i)=>`${xAt(i).toFixed(1)},${yS(v[k]).toFixed(1)}`).join(' ');
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Proyección 2028</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>MOTOR BAYESIANO</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',padding:'.1rem .4rem',borderRadius:'3px',fontWeight:700,background:gana?'#10b98122':'#ef444422',color:gana?C.green:C.red,border:`1px solid ${gana?C.green:C.red}40`}}>{gana?'▲ FP GANARÍA':'▼ PRM GANARÍA'}</span>
        </div>
        <Link href="/objetivo" style={{padding:'0 .65rem',height:'26px',background:C.fp,borderRadius:'5px',color:'#fff',fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center',fontWeight:500}}>Ver Objetivo 2028 →</Link>
      </div>

      {/* KPIs proyección */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="FP proyectado" value={`${fpP.toFixed(1)}%`} sub="Modelo bayesiano" color={C.fp}/>
        <KpiCard label="PRM proyectado" value={`${prmP.toFixed(1)}%`} sub="Fundamental" color={C.prm}/>
        <KpiCard label="Margen" value={`${Math.abs(fpP-prmP).toFixed(1)}pp`} sub={gana?'FP adelante':'PRM adelante'} color={gana?C.green:C.red}/>
        <KpiCard label="FP última enc." value={`${Number(p.fp_ultima_encuesta||0).toFixed(1)}%`} sub="Intención candidato" color={C.fp}/>
        <KpiCard label="Padrón proy. 2028" value={fmt(Number(p.padron_proyectado_2028||0))} sub="+5% vs 2024" color={C.amber}/>
        <KpiCard label="Swing FP 2020→24" value={`${Number(p.swing_fp_2024||0)>0?'+':''}${Number(p.swing_fp_2024||0).toFixed(1)}pp`} sub="Tendencia histórica" color={Number(p.swing_fp_2024||0)>0?C.green:C.red}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:'.6rem',marginBottom:'.6rem'}}>
        {/* Modelo explicado */}
        <div style={S.card}>
          <div style={S.hdr}><span style={S.ct}>Composición del modelo bayesiano</span><span style={S.cb}>3 componentes</span></div>
          <div style={{padding:'.75rem'}}>
            <div style={{marginBottom:'1rem',fontSize:'.72rem',color:C.muted2,lineHeight:1.6}}>
              El modelo combina tres fuentes con pesos diferenciados para proyectar el resultado presidencial 2028.
            </div>
            {[
              {label:'Intención de voto (encuestas)',peso:'40%',fp:`${Number(p.fp_prom_intencion||0).toFixed(1)}%`,prm:`${Number(p.prm_prom_intencion||0).toFixed(1)}%`,color:C.fp},
              {label:'Simpatía partidaria (encuestas)',peso:'25%',fp:`${Number(p.fp_prom_simpatia||0).toFixed(1)}%`,prm:'—',color:C.amber},
              {label:'Fundamentals JCE 2024',peso:'35%',fp:`${Number(p.fp_pct_2024||0).toFixed(1)}%`,prm:`${Number(p.prm_pct_2024||0).toFixed(1)}%`,color:C.muted2},
            ].map(comp=>(
              <div key={comp.label} style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:'.5rem',alignItems:'center',padding:'.45rem 0',borderBottom:'1px solid #ffffff06'}}>
                <span style={{fontSize:'.73rem',color:C.text}}>{comp.label}</span>
                <span style={{fontFamily:'monospace',fontSize:'.68rem',color:C.muted,background:C.bg3,padding:'.08rem .3rem',borderRadius:'3px'}}>peso {comp.peso}</span>
                <span style={{fontFamily:'monospace',fontSize:'.72rem',color:C.fp,fontWeight:600,minWidth:'48px',textAlign:'right'}}>FP {comp.fp}</span>
                <span style={{fontFamily:'monospace',fontSize:'.72rem',color:C.prm,minWidth:'52px',textAlign:'right'}}>PRM {comp.prm}</span>
              </div>
            ))}
            <div style={{marginTop:'1rem',padding:'.65rem',background:'#e8294a0a',border:'1px solid #e8294a25',borderRadius:'8px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'.72rem',fontWeight:600}}>Resultado proyectado</span>
                <div style={{display:'flex',gap:'1rem',fontFamily:'monospace',fontSize:'.8rem',fontWeight:700}}>
                  <span style={{color:C.fp}}>FP {fpP.toFixed(1)}%</span>
                  <span style={{color:C.muted}}>vs</span>
                  <span style={{color:C.prm}}>PRM {prmP.toFixed(1)}%</span>
                </div>
              </div>
              <div style={{fontSize:'.65rem',color:C.muted,marginTop:'.3rem'}}>
                Incluye bonus +{Number(p.swing_fp_2024||0)>0?(Number(p.swing_fp_2024||0)*0.5).toFixed(1):0}pp por swing positivo 2020→2024
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico encuestas */}
        <div style={S.card}>
          <div style={S.hdr}><span style={S.ct}>Tendencia encuestas 2026</span><span style={S.cb}>Intención + simpatía</span></div>
          <div style={{padding:'.75rem'}}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto'}}>
              {[minV,Math.round((minV+maxV)/2),maxV].map(v=>(
                <g key={v}>
                  <line x1={PL} y1={yS(v)} x2={W-PR} y2={yS(v)} stroke="#252a3a" strokeWidth="0.5" strokeDasharray="3,3"/>
                  <text x={PL-4} y={yS(v)} textAnchor="end" dominantBaseline="middle" fill="#5a6185" fontSize="8" fontFamily="monospace">{v}%</text>
                </g>
              ))}
              <line x1={PL} y1={PT} x2={PL} y2={H-PB} stroke="#2f3550" strokeWidth="0.5"/>
              <line x1={PL} y1={H-PB} x2={W-PR} y2={H-PB} stroke="#2f3550" strokeWidth="0.5"/>
              {/* Línea proyección */}
              {vals.length>0&&<line x1={xAt(vals.length-1)} y1={yS(vals[vals.length-1].fp)} x2={W-PR} y2={yS(fpP)} stroke={C.fp} strokeWidth="1" strokeDasharray="5,3" opacity="0.6"/>}
              <polyline points={poly('prm')} fill="none" stroke={C.prm} strokeWidth="1.5" strokeLinejoin="round"/>
              <polyline points={poly('fp')} fill="none" stroke={C.fp} strokeWidth="2" strokeLinejoin="round"/>
              {vals.map((v,i)=><circle key={`fp${i}`} cx={xAt(i)} cy={yS(v.fp)} r="3" fill={C.fp}/>)}
              {vals.map((v,i)=><circle key={`prm${i}`} cx={xAt(i)} cy={yS(v.prm)} r="3" fill={C.prm}/>)}
              {/* Punto proyectado */}
              <circle cx={W-PR} cy={yS(fpP)} r="4" fill={C.fp} opacity="0.7"/>
              <circle cx={W-PR} cy={yS(prmP)} r="4" fill={C.prm} opacity="0.7"/>
              <text x={W-PR+5} y={yS(fpP)} dominantBaseline="middle" fill={C.fp} fontSize="8" fontFamily="monospace">2028</text>
              {all.map((e:any,i:number)=>(
                <text key={i} x={xAt(i)} y={H-4} textAnchor="middle" fill="#5a6185" fontSize="7" fontFamily="monospace">{e.fecha?.slice(5)}</text>
              ))}
            </svg>
            <div style={{display:'flex',gap:'.75rem',marginTop:'.5rem',fontSize:'.65rem',justifyContent:'center'}}>
              {[{l:'PRM',c:C.prm},{l:'FP',c:C.fp},{l:'Proyección 2028 (---)',c:C.fp}].map(x=>(
                <span key={x.l} style={{display:'flex',alignItems:'center',gap:'.3rem'}}>
                  <span style={{display:'inline-block',width:'12px',height:'2px',background:x.c,borderRadius:'1px'}}/>
                  <span style={{color:x.c}}>{x.l}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparativa 2024 vs proyección */}
      <div style={S.card}>
        <div style={S.hdr}><span style={S.ct}>2024 real vs 2028 proyectado</span></div>
        <div style={{padding:'.75rem',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
          {[
            {label:'FP 2024 real',value:`${Number(p.fp_pct_2024||0).toFixed(2)}%`,color:C.fp,sub:`${fmt(Number(p.fp_votos_2024||0))} votos`},
            {label:'FP 2028 proyectado',value:`${fpP.toFixed(2)}%`,color:C.fp,sub:`Δ ${(fpP-Number(p.fp_pct_2024||0))>0?'+':''}${(fpP-Number(p.fp_pct_2024||0)).toFixed(1)}pp`},
            {label:'PRM 2024 real',value:`${Number(p.prm_pct_2024||0).toFixed(2)}%`,color:C.prm,sub:`${fmt(Number(p.prm_votos_2024||0))} votos`},
            {label:'PRM 2028 proyectado',value:`${prmP.toFixed(2)}%`,color:C.prm,sub:`Fundamental sin alianza`},
          ].map(k=>(
            <div key={k.label} style={{background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'8px',padding:'.65rem'}}>
              <div style={{fontFamily:'monospace',fontSize:'.56rem',textTransform:'uppercase',letterSpacing:'.1em',color:C.muted,marginBottom:'.3rem'}}>{k.label}</div>
              <div style={{fontFamily:'monospace',fontSize:'1.4rem',fontWeight:700,color:k.color}}>{k.value}</div>
              <div style={{fontSize:'.62rem',color:C.muted,marginTop:'.2rem'}}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
