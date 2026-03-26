import { supabase } from '@/lib/supabase';
import { C, bc, fmt } from '@/lib/utils';
import { KpiCard, BloqueBadge } from '@/components/ui';
import Link from 'next/link';
export const revalidate = 3600;

export default async function AlcaldesPage() {
  const [{ data: prov }, { data: nac }] = await Promise.all([
    supabase.from('sie_alcaldes_provincia').select('*').eq('eleccion_id',2).order('provincia',{ascending:true}),
    supabase.from('sie_bloques_nacional').select('*').eq('eleccion_id',2).eq('tipo_cargo','alcalde').order('votos',{ascending:false}),
  ]);

  const bMap: Record<string,number>={};
  let totalValidos=0;
  nac?.forEach((b:any)=>{ bMap[b.bloque]=Number(b.votos); totalValidos=Number(b.votos_validos); });

  // Pivot: provincia → { PRM, FP, PLD }
  const provMap: Record<string,Record<string,number>> = {};
  prov?.forEach((r:any) => {
    if (!provMap[r.provincia]) provMap[r.provincia]={};
    provMap[r.provincia][r.bloque]=Number(r.votos);
    provMap[r.provincia]._pct_prm = r.bloque==='PRM' ? Number(r.pct) : (provMap[r.provincia]._pct_prm||0);
    provMap[r.provincia]._pct_fp = r.bloque==='FP' ? Number(r.pct) : (provMap[r.provincia]._pct_fp||0);
    provMap[r.provincia]._pct_pld = r.bloque==='PLD' ? Number(r.pct) : (provMap[r.provincia]._pct_pld||0);
  });

  const provincias = Object.entries(provMap).map(([nombre, d]) => {
    const prm=d['PRM']||0, fp=d['FP']||0, pld=d['PLD']||0;
    const total=prm+fp+pld||1;
    const prmPct=prm/total*100, fpPct=fp/total*100, pldPct=pld/total*100;
    const ganador = prmPct>fpPct&&prmPct>pldPct?'PRM':fpPct>pldPct?'FP':'PLD';
    return { nombre, prm, fp, pld, prmPct, fpPct, pldPct, ganador, margen:fpPct-prmPct };
  }).sort((a,b)=>b.fpPct-a.fpPct);

  const ganadores = { PRM: provincias.filter(p=>p.ganador==='PRM').length, FP: provincias.filter(p=>p.ganador==='FP').length, PLD: provincias.filter(p=>p.ganador==='PLD').length };
  const fpTotal=bMap['FP']||0, prmTotal=bMap['PRM']||0;
  const fpPctNac=totalValidos>0?fpTotal/totalValidos*100:0;
  const prmPctNac=totalValidos>0?prmTotal/totalValidos*100:0;

  const s={background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'} as const;
  const h={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1} as const;
  const th={padding:'.35rem .65rem',textAlign:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' as const,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap' as const};
  const td=(e?:any)=>({padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',...e});

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Alcaldes 2024</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>FEBRERO 18</span>
        </div>
        <Link href="/dashboard" style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center'}}>← Dashboard</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="FP votos" value={fmt(fpTotal)} sub={`${fpPctNac.toFixed(1)}% nac.`} color={C.fp}/>
        <KpiCard label="PRM votos" value={fmt(prmTotal)} sub={`${prmPctNac.toFixed(1)}% nac.`} color={C.prm}/>
        <KpiCard label="FP lidera" value={`${ganadores.FP} prov.`} sub="Por votos bloque" color={C.fp}/>
        <KpiCard label="PRM lidera" value={`${ganadores.PRM} prov.`} sub="Por votos bloque" color={C.prm}/>
        <KpiCard label="PLD lidera" value={`${ganadores.PLD} prov.`} sub="Por votos bloque" color={C.pld}/>
        <KpiCard label="Margen PRM-FP" value={`${(prmPctNac-fpPctNac).toFixed(1)}pp`} sub="Diferencia nac." color={C.red}/>
      </div>
      <div style={s}>
        <div style={h}>
          <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Resultados por provincia — ordenado FP desc</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>{provincias.length} provincias</span>
        </div>
        <div style={{maxHeight:'580px',overflowY:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
            <thead><tr>
              <th style={th}>#</th><th style={th}>Provincia</th>
              <th style={{...th,textAlign:'right'}}>FP %</th><th style={{...th,textAlign:'right'}}>PRM %</th>
              <th style={{...th,textAlign:'right'}}>PLD %</th>
              <th style={{...th,textAlign:'center'}}>Líder</th><th style={{...th,textAlign:'right'}}>Margen FP</th>
            </tr></thead>
            <tbody>
              {provincias.map((p,i)=>(
                <tr key={p.nombre}>
                  <td style={td({color:C.muted,fontFamily:'monospace',fontSize:'.65rem'})}>{i+1}</td>
                  <td style={td({fontWeight:500})}>{p.nombre}</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{p.fpPct.toFixed(2)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.prm})}>{p.prmPct.toFixed(2)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.pld})}>{p.pldPct.toFixed(2)}%</td>
                  <td style={td({textAlign:'center'})}><BloqueBadge bloque={p.ganador}/></td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:p.margen>=0?C.green:C.red})}>{p.margen>=0?'+':''}{p.margen.toFixed(1)}pp</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
