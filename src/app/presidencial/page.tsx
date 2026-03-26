import { supabase } from '@/lib/supabase';
import { C, bc, fmt } from '@/lib/utils';
import { KpiCard, Bar, BloqueBadge } from '@/components/ui';
import Link from 'next/link';
export const revalidate = 3600;

export default async function PresidencialPage() {
  const [{ data: bloquesNac }, { data: porProv }, { data: partidos }] = await Promise.all([
    supabase.from('sie_bloques_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente').order('votos',{ascending:false}),
    supabase.from('sie_bloques_provincia').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente'),
    supabase.from('sie_votos_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente').order('votos',{ascending:false}),
  ]);

  const bMap: Record<string,{votos:number,pct:number}> = {};
  let totalValidos = 0;
  bloquesNac?.forEach((b:any) => { bMap[b.bloque]={votos:Number(b.votos),pct:Number(b.pct)}; totalValidos=Number(b.votos_validos); });

  const provMap: Record<string,any> = {};
  porProv?.forEach((r:any) => {
    if (!provMap[r.provincia]) provMap[r.provincia] = { validos: Number(r.votos_validos) };
    provMap[r.provincia][r.bloque] = Number(r.votos);
  });
  const provincias = Object.entries(provMap).map(([nombre,d]) => {
    const fp=d['FP']||0, prm=d['PRM']||0, pld=d['PLD']||0, val=d.validos||1;
    return { nombre, fpPct:fp/val*100, prmPct:prm/val*100, pldPct:pld/val*100, margen:(fp-prm)/val*100 };
  }).sort((a,b) => b.fpPct - a.fpPct);

  const fpPct=bMap['FP']?.pct||0, prmPct=bMap['PRM']?.pct||0, pldPct=bMap['PLD']?.pct||0;
  const s={background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'} as const;
  const h={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1} as const;
  const th={padding:'.35rem .65rem',textAlign:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' as const,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap' as const};
  const td=(e?:any)=>({padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',...e});

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Presidencial 2024</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>MAYO 19</span>
        </div>
        <Link href="/dashboard" style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center'}}>← Dashboard</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="PRM Bloque" value={`${prmPct.toFixed(2)}%`} sub={`${fmt(bMap['PRM']?.votos||0)} votos`} color={C.prm}/>
        <KpiCard label="FP Bloque" value={`${fpPct.toFixed(2)}%`} sub={`${fmt(bMap['FP']?.votos||0)} votos`} color={C.fp}/>
        <KpiCard label="PLD" value={`${pldPct.toFixed(2)}%`} sub={`${fmt(bMap['PLD']?.votos||0)} votos`} color={C.pld}/>
        <KpiCard label="Votos válidos" value={fmt(totalValidos)} sub="Nacional" color={C.green}/>
        <KpiCard label="Margen PRM-FP" value={`${(prmPct-fpPct).toFixed(1)}pp`} sub="Sin ballotage" color={C.red}/>
        <KpiCard label="Provincias" value={`${provincias.length}`} sub="Cobertura total" color={C.amber}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'.6rem'}}>
        <div style={s}>
          <div style={h}>
            <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Resultados por provincia — FP desc</span>
            <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>{provincias.length} prov.</span>
          </div>
          <div style={{maxHeight:'500px',overflowY:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
              <thead><tr>
                <th style={th}>#</th><th style={th}>Provincia</th>
                <th style={{...th,textAlign:'right'}}>FP %</th><th style={{...th,textAlign:'right'}}>PRM %</th>
                <th style={{...th,textAlign:'right'}}>PLD %</th><th style={{...th,textAlign:'right'}}>Margen</th>
                <th style={{...th,textAlign:'center'}}>Resultado</th>
              </tr></thead>
              <tbody>
                {provincias.map((p,i)=>(
                  <tr key={p.nombre}>
                    <td style={td({color:C.muted,fontFamily:'monospace',fontSize:'.65rem'})}>{i+1}</td>
                    <td style={td({fontWeight:500})}>{p.nombre}</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{p.fpPct.toFixed(2)}%</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:C.prm})}>{p.prmPct.toFixed(2)}%</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:C.pld})}>{p.pldPct.toFixed(2)}%</td>
                    <td style={td({textAlign:'right',fontFamily:'monospace',color:p.margen>=0?C.green:C.red})}>{p.margen>=0?'+':''}{p.margen.toFixed(1)}pp</td>
                    <td style={td({textAlign:'center'})}><BloqueBadge bloque={p.prmPct>p.fpPct?'PRM':'FP'}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
          <div style={s}>
            <div style={h}><span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Bloques electorales</span></div>
            <div style={{padding:'.75rem'}}>
              {bloquesNac?.map((b:any)=>(
                <Bar key={b.bloque} pct={Number(b.pct)} color={bc(b.bloque)} label={b.bloque} val={`${Number(b.pct).toFixed(2)}%`}/>
              ))}
            </div>
          </div>
          <div style={s}>
            <div style={h}><span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Por partido</span><span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>{partidos?.length} partidos</span></div>
            <div style={{maxHeight:'280px',overflowY:'auto'}}>
              {partidos?.map((p:any)=>(
                <div key={p.partido} style={{display:'flex',justifyContent:'space-between',padding:'.3rem .75rem',borderBottom:'1px solid #ffffff06',fontSize:'.73rem'}}>
                  <span style={{color:C.muted2}}><span style={{display:'inline-block',width:'7px',height:'7px',borderRadius:'50%',background:bc(p.partido),marginRight:'.35rem',verticalAlign:'middle'}}/>{p.partido}</span>
                  <span style={{fontFamily:'monospace',fontSize:'.72rem',fontWeight:600}}>{(Number(p.votos)/totalValidos*100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
