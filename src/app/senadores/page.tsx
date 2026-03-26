import { supabase } from '@/lib/supabase';
import { C, bc, fmt } from '@/lib/utils';
import { KpiCard, BloqueBadge } from '@/components/ui';
import Link from 'next/link';
export const revalidate = 3600;

export default async function SenadoresPage() {
  const [{ data: prov }, { data: nac }] = await Promise.all([
    supabase.from('sie_senadores_provincia').select('*').eq('eleccion_id',3).order('provincia',{ascending:true}),
    supabase.from('sie_bloques_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','senador').order('votos',{ascending:false}),
  ]);
  const bMap: Record<string,number>={};
  let totalValidos=0;
  nac?.forEach((b:any)=>{ bMap[b.bloque]=Number(b.votos); totalValidos=Number(b.votos_validos); });
  const g={PRM:0,FP:0,PLD:0,Otros:0};
  prov?.forEach((p:any)=>{ if(p.ganador==='PRM') g.PRM++; else if(p.ganador==='FP') g.FP++; else if(p.ganador==='PLD') g.PLD++; else g.Otros++; });

  const s={background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'} as const;
  const h={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1} as const;
  const th={padding:'.35rem .65rem',textAlign:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' as const,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap' as const};
  const td=(e?:any)=>({padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',...e});

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Senadores 2024</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>32 PROVINCIAS</span>
        </div>
        <Link href="/dashboard" style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center'}}>← Dashboard</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="PRM gana" value={`${g.PRM}/32`} sub={`${(g.PRM/32*100).toFixed(0)}% provincias`} color={C.prm}/>
        <KpiCard label="FP gana" value={`${g.FP}/32`} sub={`${(g.FP/32*100).toFixed(0)}% provincias`} color={C.fp}/>
        <KpiCard label="PLD gana" value={`${g.PLD}/32`} sub={`${(g.PLD/32*100).toFixed(0)}% provincias`} color={C.pld}/>
        <KpiCard label="Otros" value={`${g.Otros}/32`} sub="Restantes" color={C.muted2}/>
        <KpiCard label="FP votos" value={fmt(bMap['FP']||0)} sub={`${totalValidos>0?((bMap['FP']||0)/totalValidos*100).toFixed(1):0}% nac.`} color={C.fp}/>
        <KpiCard label="PRM votos" value={fmt(bMap['PRM']||0)} sub={`${totalValidos>0?((bMap['PRM']||0)/totalValidos*100).toFixed(1):0}% nac.`} color={C.prm}/>
      </div>
      <div style={{...s,marginBottom:'.6rem'}}>
        <div style={h}><span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Balance del Senado 2024</span><span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>32 senadores</span></div>
        <div style={{padding:'.75rem'}}>
          <div style={{height:'14px',display:'flex',borderRadius:'4px',overflow:'hidden',marginBottom:'.5rem'}}>
            <div style={{flex:g.PRM,background:C.prm}}/><div style={{flex:g.FP,background:C.fp}}/><div style={{flex:g.PLD,background:C.pld}}/><div style={{flex:g.Otros,background:C.muted}}/>
          </div>
          <div style={{display:'flex',gap:'1.5rem',fontSize:'.7rem'}}>
            {[{label:'PRM',val:g.PRM,color:C.prm},{label:'FP',val:g.FP,color:C.fp},{label:'PLD',val:g.PLD,color:C.pld},{label:'Otros',val:g.Otros,color:C.muted2}].map(b=>(
              <span key={b.label}><span style={{display:'inline-block',width:'8px',height:'8px',borderRadius:'2px',background:b.color,marginRight:'.3rem',verticalAlign:'middle'}}/><span style={{color:b.color,fontWeight:600}}>{b.label}</span><span style={{color:C.muted,marginLeft:'.3rem'}}>{b.val}</span></span>
            ))}
          </div>
        </div>
      </div>
      <div style={s}>
        <div style={h}><span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Resultados por provincia</span><span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>{prov?.length||0} provincias</span></div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
          <thead><tr>
            <th style={th}>Provincia</th><th style={{...th,textAlign:'right'}}>FP %</th><th style={{...th,textAlign:'right'}}>PRM %</th>
            <th style={{...th,textAlign:'right'}}>PLD %</th><th style={{...th,textAlign:'right'}}>Válidos</th>
            <th style={{...th,textAlign:'center'}}>Ganador</th><th style={{...th,textAlign:'right'}}>Margen FP</th>
          </tr></thead>
          <tbody>
            {prov?.map((p:any)=>{
              const fpPct=Number(p.pct_fp)||0,prmPct=Number(p.pct_prm)||0,pldPct=Number(p.pct_pld)||0;
              const margen=fpPct-prmPct;
              return(
                <tr key={p.provincia_id}>
                  <td style={td({fontWeight:500})}>{p.provincia}</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{fpPct.toFixed(2)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.prm})}>{prmPct.toFixed(2)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.pld})}>{pldPct.toFixed(2)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.muted2})}>{fmt(Number(p.votos_validos)||0)}</td>
                  <td style={td({textAlign:'center'})}><BloqueBadge bloque={p.ganador}/></td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:margen>=0?C.green:C.red})}>{margen>=0?'+':''}{margen.toFixed(1)}pp</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
