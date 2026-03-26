import{supabase}from'@/lib/supabase';
import{C,fmt,S,td}from'@/lib/utils';
import{KpiCard,RiesgoBadge}from'@/components/ui';
import Link from'next/link';
export const revalidate=3600;
export default async function Page(){
  const{data}=await supabase.from('sie_motor_riesgo').select('*').order('brecha_pp',{ascending:true});
  const rows=(data||[]) as any[];
  const cnt=(r:string)=>rows.filter(x=>x.riesgo===r).length;
  const fortin=cnt('FORTÍN — proteger'),critico=cnt('CRÍTICO — < 5pp'),disputado=cnt('DISPUTADO — 5-15pp'),dificil=cnt('DIFÍCIL — 15-25pp'),adverso=cnt('ADVERSO — > 25pp');
  const palancas:Record<string,number>={};
  rows.forEach(r=>{palancas[r.palanca_recomendada]=(palancas[r.palanca_recomendada]||0)+1;});
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Mapa de Riesgo Territorial</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>32 PROVINCIAS</span>
        </div>
        <Link href="/analisis" style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center'}}>← Centro Análisis</Link>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="Fortines FP" value={`${fortin}`} sub="Ya ganamos" color={C.green}/>
        <KpiCard label="Críticos" value={`${critico}`} sub="Brecha < 5pp" color={C.red}/>
        <KpiCard label="Disputados" value={`${disputado}`} sub="5-15pp" color={C.amber}/>
        <KpiCard label="Difíciles" value={`${dificil}`} sub="15-25pp" color={C.prm}/>
        <KpiCard label="Adversos" value={`${adverso}`} sub="Más de 25pp" color={C.muted2}/>
      </div>

      {/* Barra visual de distribución */}
      <div style={{...S.card,marginBottom:'.6rem'}}>
        <div style={S.hdr}><span style={S.ct}>Distribución estratégica — 32 provincias</span></div>
        <div style={{padding:'.75rem'}}>
          <div style={{height:'20px',display:'flex',borderRadius:'6px',overflow:'hidden',marginBottom:'.5rem'}}>
            <div style={{flex:fortin,background:C.green}}/>
            <div style={{flex:critico,background:C.red}}/>
            <div style={{flex:disputado,background:C.amber}}/>
            <div style={{flex:dificil,background:C.prm}}/>
            <div style={{flex:adverso,background:C.muted}}/>
          </div>
          <div style={{display:'flex',gap:'1.25rem',fontSize:'.68rem',flexWrap:'wrap'}}>
            {[{l:'Fortín',v:fortin,c:C.green},{l:'Crítico',v:critico,c:C.red},{l:'Disputado',v:disputado,c:C.amber},{l:'Difícil',v:dificil,c:C.prm},{l:'Adverso',v:adverso,c:C.muted}].map(x=>(
              <span key={x.l} style={{display:'flex',alignItems:'center',gap:'.3rem'}}>
                <span style={{width:'10px',height:'10px',background:x.c,borderRadius:'2px',display:'inline-block'}}/>
                <span style={{color:x.c,fontWeight:600}}>{x.l}</span>
                <span style={{color:C.muted}}>{x.v} prov.</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'3fr 1fr',gap:'.6rem'}}>
        {/* Tabla principal */}
        <div style={S.card}>
          <div style={S.hdr}>
            <span style={S.ct}>Análisis por provincia — ordenado por brecha FP</span>
            <span style={S.cb}>{rows.length} provincias</span>
          </div>
          <div style={{maxHeight:'520px',overflowY:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
              <thead><tr>
                {['Provincia','FP %','Brecha','Swing','Alianza 50%','Riesgo','Palanca'].map((h,i)=>(
                  <th key={h} style={{...S.th,textAlign:i>0&&i<6?'right':'left'}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {rows.map((r:any)=>{
                  const brecha=Number(r.brecha_pp);
                  const swing=Number(r.swing_fp);
                  const brechaColor=brecha<=0?C.green:brecha<5?C.red:brecha<15?C.amber:brecha<25?C.prm:C.muted;
                  return(
                    <tr key={r.provincia_id}>
                      <td style={td({fontWeight:500})}>{r.provincia}</td>
                      <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{Number(r.fp_pct).toFixed(1)}%</td>
                      <td style={td({textAlign:'right',fontFamily:'monospace',color:brechaColor,fontWeight:600})}>{brecha>0?'+':''}{brecha.toFixed(1)}pp</td>
                      <td style={td({textAlign:'right',fontFamily:'monospace',color:swing>0?C.green:C.red})}>{swing>0?'+':''}{swing.toFixed(1)}pp</td>
                      <td style={td({textAlign:'right',fontFamily:'monospace',color:r.resultado_alianza_50==='GANA c/alianza'?C.green:C.red,fontSize:'.68rem'})}>{r.resultado_alianza_50}</td>
                      <td style={td({textAlign:'right'})}><RiesgoBadge r={r.riesgo}/></td>
                      <td style={td({fontSize:'.66rem',color:C.muted2})}>{r.palanca_recomendada}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Palancas recomendadas */}
        <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
          <div style={S.card}>
            <div style={S.hdr}><span style={S.ct}>Palancas por frecuencia</span></div>
            <div style={{padding:'.75rem'}}>
              {Object.entries(palancas).sort((a,b)=>b[1]-a[1]).map(([pal,cnt_])=>(
                <div key={pal} style={{marginBottom:'.55rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.15rem',fontSize:'.7rem'}}>
                    <span style={{color:C.text}}>{pal}</span>
                    <span style={{fontFamily:'monospace',color:C.fp,fontWeight:600}}>{cnt_} prov.</span>
                  </div>
                  <div style={{height:'4px',background:C.bg4,borderRadius:'99px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${(cnt_/32)*100}%`,background:C.fp,borderRadius:'99px'}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <div style={S.hdr}><span style={S.ct}>Acciones prioritarias</span></div>
            <div style={{padding:'.75rem'}}>
              {[
                {orden:'1',accion:'Alianza PLD en provincias críticas y disputadas',prov:`${critico+disputado} prov.`,color:C.red},
                {orden:'2',accion:'Movilización abstención en provincias con baja participación',prov:`${rows.filter((r:any)=>Number(r.participacion_pct)<50).length} prov.`,color:C.amber},
                {orden:'3',accion:'Consolidar fortines y evitar pérdidas',prov:`${fortin} prov.`,color:C.green},
                {orden:'4',accion:'Swing orgánico en adversos con PLD alto',prov:`${rows.filter((r:any)=>Number(r.pld_pct)>15&&r.riesgo.includes('ADVERSO')).length} prov.`,color:C.pld},
              ].map(a=>(
                <div key={a.orden} style={{padding:'.4rem 0',borderBottom:'1px solid #ffffff06',display:'flex',gap:'.5rem',alignItems:'flex-start'}}>
                  <span style={{fontFamily:'monospace',fontSize:'.7rem',color:a.color,fontWeight:700,minWidth:'16px'}}>{a.orden}</span>
                  <div>
                    <div style={{fontSize:'.72rem',color:C.text}}>{a.accion}</div>
                    <div style={{fontSize:'.62rem',color:C.muted,marginTop:'.1rem'}}>{a.prov}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
