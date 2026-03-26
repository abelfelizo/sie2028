import{supabase}from'@/lib/supabase';
import{C,fmt,S,td}from'@/lib/utils';
import{KpiCard}from'@/components/ui';
import Link from'next/link';
export const revalidate=3600;
export default async function Page(){
  const{data:obj}=await supabase.from('sie_motor_objetivo').select('*').single();
  const o=obj as any;
  if(!o) return <div style={{padding:'2rem',color:'#5a6185'}}>Cargando...</div>;
  const fp=Number(o.fp_2024||0),meta=Number(o.meta_votos||0),gap=Number(o.gap_total||0);
  const progreso=fp/meta*100;
  const fuentes=[
    {label:'Alianza PLD → FP (50%)',votos:Number(o.fuente_alianza_pld_50||0),pct:(Number(o.fuente_alianza_pld_50||0)/gap*100),color:C.pld,icon:'①'},
    {label:'Movilización abstención (35%)',votos:Number(o.fuente_movilizacion||0),pct:(Number(o.fuente_movilizacion||0)/gap*100),color:C.amber,icon:'②'},
    {label:'Nuevos electores 2028',votos:Number(o.fuente_nuevos_electores||0),pct:(Number(o.fuente_nuevos_electores||0)/gap*100),color:C.prm,icon:'③'},
    {label:'Swing orgánico FP (+3%)',votos:Number(o.fuente_swing_organico||0),pct:(Number(o.fuente_swing_organico||0)/gap*100),color:C.fp,icon:'④'},
  ];
  const totalFuentes=fuentes.reduce((a,f)=>a+f.votos,0);
  const gapResidual=Math.max(0,gap-totalFuentes);
  const evalR=o.evaluacion_realista==='SUFICIENTE';
  const evalO=o.evaluacion_optimista==='SUFICIENTE';
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Objetivo 2028</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>META ELECTORAL</span>
        </div>
        <Link href="/proyeccion" style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center'}}>← Proyección</Link>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="FP base 2024" value={fmt(fp)} sub={`${(fp/Number(o.validos_2024||1)*100).toFixed(1)}% válidos`} color={C.fp}/>
        <KpiCard label="Meta a superar" value={fmt(meta)} sub="PRM 2024 +2%" color={C.red}/>
        <KpiCard label="Gap total" value={fmt(gap)} sub="Votos a conseguir" color={C.amber}/>
        <KpiCard label="Fuentes realistas" value={fmt(totalFuentes)} sub={`${(totalFuentes/gap*100).toFixed(0)}% del gap`} color={evalR?C.green:C.red}/>
        <div style={{background:C.bg2,border:`2px solid ${evalR?C.green:C.red}`,borderRadius:'6px',padding:'.65rem .75rem',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'.3rem'}}>
          <div style={{fontFamily:'monospace',fontSize:'.56rem',textTransform:'uppercase',color:C.muted}}>Evaluación</div>
          <div style={{fontFamily:'monospace',fontSize:'1rem',fontWeight:700,color:evalR?C.green:C.red}}>{evalR?'ALCANZABLE':'DESAFIANTE'}</div>
          <div style={{fontSize:'.6rem',color:C.muted}}>Escenario realista</div>
        </div>
      </div>

      {/* Barra de progreso principal */}
      <div style={{...S.card,marginBottom:'.6rem'}}>
        <div style={S.hdr}><span style={S.ct}>Progreso hacia la meta electoral 2028</span><span style={S.cb}>Base JCE 2024</span></div>
        <div style={{padding:'.75rem 1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.5rem',fontSize:'.75rem'}}>
            <span>FP 2024: <strong style={{color:C.fp}}>{fmt(fp)}</strong></span>
            <span style={{color:C.muted2}}>Meta: {fmt(meta)}</span>
          </div>
          <div style={{height:'20px',background:C.bg4,borderRadius:'6px',overflow:'hidden',position:'relative',marginBottom:'.4rem'}}>
            <div style={{height:'100%',width:`${Math.min(progreso,100)}%`,background:`linear-gradient(90deg,#7a1428,${C.fp})`,borderRadius:'6px',transition:'width 1s'}}/>
            {fuentes.map((f,i)=>{
              const offset=progreso+fuentes.slice(0,i).reduce((a,x)=>a+x.pct,0);
              return <div key={i} style={{position:'absolute',top:0,left:`${Math.min(offset,100)}%`,height:'100%',width:`${Math.min(f.pct,100-offset)}%`,background:f.color,opacity:0.7}}/>;
            })}
            <div style={{position:'absolute',top:'50%',right:'8px',transform:'translateY(-50%)',fontFamily:'monospace',fontSize:'.58rem',color:'#fff',fontWeight:700}}>
              {evalR?`+${fmt(totalFuentes-gap)} excedente`:`−${fmt(gapResidual)} restante`}
            </div>
          </div>
          <div style={{display:'flex',gap:'.5rem',fontSize:'.62rem',flexWrap:'wrap'}}>
            <span style={{display:'flex',alignItems:'center',gap:'.2rem'}}><span style={{width:'10px',height:'10px',background:`linear-gradient(90deg,#7a1428,${C.fp})`,borderRadius:'2px',display:'inline-block'}}/> FP base {progreso.toFixed(0)}%</span>
            {fuentes.map(f=><span key={f.label} style={{display:'flex',alignItems:'center',gap:'.2rem'}}><span style={{width:'10px',height:'10px',background:f.color,borderRadius:'2px',display:'inline-block',opacity:0.7}}/> <span style={{color:C.muted2}}>{f.icon}</span></span>)}
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.6rem'}}>
        {/* Fuentes de votos */}
        <div style={S.card}>
          <div style={S.hdr}><span style={S.ct}>Fuentes de votos identificadas</span><span style={S.cb}>Escenario realista</span></div>
          <div style={{padding:'.75rem'}}>
            {fuentes.map(f=>(
              <div key={f.label} style={{marginBottom:'.75rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.2rem'}}>
                  <span style={{fontSize:'.73rem',color:C.text}}><span style={{color:f.color,fontWeight:700,marginRight:'.35rem'}}>{f.icon}</span>{f.label}</span>
                  <span style={{fontFamily:'monospace',fontSize:'.72rem',color:f.color,fontWeight:600}}>{fmt(f.votos)}</span>
                </div>
                <div style={{height:'6px',background:C.bg4,borderRadius:'99px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${Math.min(f.pct,100)}%`,background:f.color,borderRadius:'99px'}}/>
                </div>
                <div style={{fontSize:'.6rem',color:C.muted,marginTop:'.15rem'}}>{f.pct.toFixed(0)}% del gap total</div>
              </div>
            ))}
            <div style={{marginTop:'.5rem',padding:'.55rem',background:C.bg3,borderRadius:'8px',border:`1px solid ${C.border2}`}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'.73rem',marginBottom:'.2rem'}}>
                <span style={{fontWeight:600}}>Total fuentes</span>
                <span style={{fontFamily:'monospace',fontWeight:700,color:evalR?C.green:C.red}}>{fmt(totalFuentes)}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'.68rem',color:C.muted2}}>
                <span>Gap: {fmt(gap)}</span>
                <span style={{color:evalR?C.green:C.red}}>{evalR?`Excedente: +${fmt(totalFuentes-gap)}`:`Faltante: −${fmt(gapResidual)}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Escenarios */}
        <div style={S.card}>
          <div style={S.hdr}><span style={S.ct}>Escenarios comparativos</span></div>
          <div style={{padding:'.75rem'}}>
            {[
              {label:'Sin alianza, sin movilización',fp:fp,meta,eval_:false,desc:'Base 2024 sin cambios'},
              {label:'Alianza PLD 50% + movilización',fp:fp+Number(o.fuente_alianza_pld_50||0)+Number(o.fuente_movilizacion||0),meta,eval_:evalR,desc:'Escenario realista'},
              {label:'Alianza PLD 80% + todos los factores',fp:fp+Number(o.fuente_alianza_pld_80||0)+Number(o.fuente_movilizacion||0)+Number(o.fuente_nuevos_electores||0)+Number(o.fuente_swing_organico||0)*2,meta,eval_:evalO,desc:'Escenario optimista'},
            ].map(e=>(
              <div key={e.label} style={{padding:'.55rem',marginBottom:'.5rem',background:C.bg3,borderRadius:'8px',border:`1px solid ${e.eval_?C.green+'40':C.border2}`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.25rem'}}>
                  <span style={{fontSize:'.72rem',fontWeight:500,color:C.text}}>{e.label}</span>
                  <span style={{fontFamily:'monospace',fontSize:'.65rem',fontWeight:700,color:e.eval_?C.green:C.red}}>{e.eval_?'✓ GANA':'✗ PIERDE'}</span>
                </div>
                <div style={{height:'5px',background:C.bg4,borderRadius:'99px',overflow:'hidden',marginBottom:'.2rem'}}>
                  <div style={{height:'100%',width:`${Math.min(e.fp/e.meta*100,100)}%`,background:e.eval_?C.green:C.fp,borderRadius:'99px'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'.62rem',color:C.muted}}>
                  <span>{fmt(Math.round(e.fp))} votos</span>
                  <span style={{color:e.eval_?C.green:C.red}}>{e.fp>=e.meta?`+${fmt(Math.round(e.fp-e.meta))}`:`−${fmt(Math.round(e.meta-e.fp))}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
