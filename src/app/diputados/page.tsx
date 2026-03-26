import { supabase } from '@/lib/supabase';
import { C, bc, fmt } from '@/lib/utils';
import { KpiCard, BloqueBadge } from '@/components/ui';
import Link from 'next/link';
export const revalidate = 3600;

export default async function DiputadosPage() {
  const [{ data: prov }, { data: nac }] = await Promise.all([
    supabase.from('sie_diputados_provincia').select('*').eq('eleccion_id',3).order('provincia',{ascending:true}),
    supabase.from('sie_bloques_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','diputado_ter').order('votos',{ascending:false}),
  ]);
  const bMap: Record<string,number>={};
  let totalValidos=0;
  nac?.forEach((b:any)=>{ bMap[b.bloque]=Number(b.votos); totalValidos=Number(b.votos_validos); });
  const l={PRM:0,FP:0,PLD:0,Otros:0};
  prov?.forEach((p:any)=>{ if(p.lider==='PRM') l.PRM++; else if(p.lider==='FP') l.FP++; else if(p.lider==='PLD') l.PLD++; else l.Otros++; });
  const fpPct=totalValidos>0?(bMap['FP']||0)/totalValidos*100:0;
  const prmPct=totalValidos>0?(bMap['PRM']||0)/totalValidos*100:0;

  const s={background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'} as const;
  const h={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1} as const;
  const th={padding:'.35rem .65rem',textAlign:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' as const,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap' as const};
  const td=(e?:any)=>({padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',...e});

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Diputados Territoriales 2024</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>32 PROVINCIAS</span>
        </div>
        <Link href="/dashboard" style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center'}}>← Dashboard</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="PRM lidera" value={`${l.PRM}/32`} sub={`${(l.PRM/32*100).toFixed(0)}% prov.`} color={C.prm}/>
        <KpiCard label="FP lidera" value={`${l.FP}/32`} sub={`${(l.FP/32*100).toFixed(0)}% prov.`} color={C.fp}/>
        <KpiCard label="PLD lidera" value={`${l.PLD}/32`} sub={`${(l.PLD/32*100).toFixed(0)}% prov.`} color={C.pld}/>
        <KpiCard label="Otros" value={`${l.Otros}/32`} sub="Restantes" color={C.muted2}/>
        <KpiCard label="FP votos" value={fmt(bMap['FP']||0)} sub={`${fpPct.toFixed(1)}% nac.`} color={C.fp}/>
        <KpiCard label="Margen PRM-FP" value={`${(prmPct-fpPct).toFixed(1)}pp`} sub="Nacional" color={C.red}/>
      </div>
      <div style={{...s,marginBottom:'.6rem'}}>
        <div style={h}><span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Liderazgo por provincia</span></div>
        <div style={{padding:'.75rem'}}>
          <div style={{height:'14px',display:'flex',borderRadius:'4px',overflow:'hidden',marginBottom:'.5rem'}}>
            <div style={{flex:l.PRM,background:C.prm}}/><div style={{flex:l.FP,background:C.fp}}/><div style={{flex:l.PLD,background:C.pld}}/><div style={{flex:l.Otros||0.01,background:C.muted}}/>
          </div>
          <div style={{display:'flex',gap:'1.5rem',fontSize:'.7rem'}}>
            {[{label:'PRM',val:l.PRM,color:C.prm},{label:'FP',val:l.FP,color:C.fp},{label:'PLD',val:l.PLD,color:C.pld}].map(b=>(
              <span key={b.label}><span style={{display:'inline-block',width:'8px',height:'8px',borderRadius:'2px',background:b.color,marginRight:'.3rem',verticalAlign:'middle'}}/><span style={{color:b.color,fontWeight:600}}>{b.label}</span><span style={{color:C.muted,marginLeft:'.3rem'}}>lidera en {b.val} prov.</span></span>
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
            <th style={{...th,textAlign:'center'}}>Líder</th><th style={{...th,textAlign:'right'}}>Margen FP</th>
          </tr></thead>
          <tbody>
            {prov?.map((p:any)=>{
              const fpPct_=Number(p.pct_fp)||0,prmPct_=Number(p.pct_prm)||0,pldPct_=Number(p.pct_pld)||0;
              const margen=fpPct_-prmPct_;
              return(
                <tr key={p.provincia_id}>
                  <td style={td({fontWeight:500})}>{p.provincia}</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{fpPct_.toFixed(2)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.prm})}>{prmPct_.toFixed(2)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.pld})}>{pldPct_.toFixed(2)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.muted2})}>{fmt(Number(p.votos_validos)||0)}</td>
                  <td style={td({textAlign:'center'})}><BloqueBadge bloque={p.lider}/></td>
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
