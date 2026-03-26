import{supabase}from'@/lib/supabase';
import{C,fmt}from'@/lib/utils';
import{KpiCard,ClasificacionBadge}from'@/components/ui';
import Link from'next/link';
export const revalidate=3600;
export default async function Page(){
  const[{data:trans},{data:pot}]=await Promise.all([
    supabase.from('sie_motor_transferencia').select('*').order('votos_pld',{ascending:false}),
    supabase.from('sie_motor_potencial').select('*').order('brecha_pp',{ascending:true}),
  ]);
  const totalPld=trans?.reduce((a:number,r:any)=>a+Number(r.votos_pld),0)??0;
  const transf50=trans?.reduce((a:number,r:any)=>a+Number(r.transferencia_50),0)??0;
  const ofensivas=pot?.filter((p:any)=>p.clasificacion==='OFENSIVO'||p.clasificacion==='GANAR').length??0;
  const potAbstencion=pot?.reduce((a:number,p:any)=>a+Number(p.potencial_abstencion||0),0)??0;
  const TH=C.TH??{padding:'.35rem .65rem',textAlign:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' as const,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap' as const};
  const td=(e?:any)=>({padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',...e});
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Centro de Análisis</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>INTELIGENCIA FP</span>
        </div>
        <Link href="/alianzas" style={{padding:'0 .65rem',height:'26px',background:C.fp,border:`1px solid ${C.fp}`,borderRadius:'5px',color:'#fff',fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center',fontWeight:500}}>Ver Simulador Alianza →</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="Votos PLD 2024" value={fmt(totalPld)} sub="Universo a capturar" color={C.pld}/>
        <KpiCard label="Transferencia 50%" value={fmt(transf50)} sub="Escenario realista" color={C.fp}/>
        <KpiCard label="Provincias ofensivas" value={`${ofensivas}`} sub="Brecha < 10pp" color={C.amber}/>
        <KpiCard label="Potencial abstención" value={fmt(potAbstencion)} sub="35% de ausentes" color={C.green}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.6rem'}}>
        {/* Motor Transferencia */}
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
            <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Motor Transferencia — PLD → FP</span>
            <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>Por provincia</span>
          </div>
          <div style={{maxHeight:'500px',overflowY:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
              <thead><tr>
                <th style={{padding:'.35rem .65rem',textAlign:'left',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>Provincia</th>
                <th style={{padding:'.35rem .65rem',textAlign:'right',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>PLD votos</th>
                <th style={{padding:'.35rem .65rem',textAlign:'right',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>Trans. 50%</th>
                <th style={{padding:'.35rem .65rem',textAlign:'right',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>Margen actual</th>
                <th style={{padding:'.35rem .65rem',textAlign:'right',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>Margen c/alianza</th>
              </tr></thead>
              <tbody>
                {trans?.map((r:any)=>{
                  const ma=Number(r.margen_fp_prm),mc=Number(r.margen_con_alianza);
                  return(
                    <tr key={r.provincia_id}>
                      <td style={td({fontWeight:500})}>{r.provincia}</td>
                      <td style={td({textAlign:'right',fontFamily:'monospace',color:C.pld})}>{fmt(Number(r.votos_pld))}</td>
                      <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{fmt(Number(r.transferencia_50))}</td>
                      <td style={td({textAlign:'right',fontFamily:'monospace',color:ma>=0?C.green:C.red})}>{ma>=0?'+':''}{ma.toFixed(1)}pp</td>
                      <td style={td({textAlign:'right',fontFamily:'monospace',color:mc>=0?C.green:C.red,fontWeight:mc>ma?600:400})}>{mc>=0?'+':''}{mc.toFixed(1)}pp</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Motor Potencial */}
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
            <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Motor Potencial — Scoring territorial</span>
            <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>32 provincias</span>
          </div>
          <div style={{maxHeight:'500px',overflowY:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
              <thead><tr>
                <th style={{padding:'.35rem .65rem',textAlign:'left',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>Provincia</th>
                <th style={{padding:'.35rem .65rem',textAlign:'right',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>FP %</th>
                <th style={{padding:'.35rem .65rem',textAlign:'right',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>Brecha</th>
                <th style={{padding:'.35rem .65rem',textAlign:'right',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>Abstención pot.</th>
                <th style={{padding:'.35rem .65rem',textAlign:'center',fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>Estado</th>
              </tr></thead>
              <tbody>
                {pot?.map((r:any)=>(
                  <tr key={r.provincia_id}>
                    <td style={td({fontWeight:500})}>{r.provincia}</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{Number(r.fp_pct).toFixed(1)}%</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:Number(r.brecha_pp)<=0?C.green:Number(r.brecha_pp)<10?C.amber:C.red})}>{Number(r.brecha_pp)>0?'+':''}{Number(r.brecha_pp).toFixed(1)}pp</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:C.muted2})}>{fmt(Number(r.potencial_abstencion||0))}</td>
                    <td style={td({textAlign:'center'})}><ClasificacionBadge c={r.clasificacion}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
