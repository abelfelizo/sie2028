import { supabase } from '@/lib/supabase';
import { C } from '@/lib/utils';
import { KpiCard } from '@/components/ui';
import Link from 'next/link';
export const revalidate = 3600;

export default async function HistoricoPage() {
  const [{ data: nac24 }, { data: nac20 }, { data: prov24 }, { data: prov20 }] = await Promise.all([
    supabase.from('sie_bloques_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente'),
    supabase.from('sie_bloques_nacional').select('*').eq('eleccion_id',1).eq('tipo_cargo','presidente'),
    supabase.from('sie_bloques_provincia').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente'),
    supabase.from('sie_bloques_provincia').select('*').eq('eleccion_id',1).eq('tipo_cargo','presidente'),
  ]);

  const toMap=(d:any[])=>{ const m:Record<string,{votos:number,pct:number}>={};  d?.forEach((b:any)=>m[b.bloque]={votos:Number(b.votos),pct:Number(b.pct)}); return m; };
  const b24=toMap(nac24||[]), b20=toMap(nac20||[]);
  const fp24=b24['FP']?.pct||0, fp20=b20['FP']?.pct||0;
  const prm24=b24['PRM']?.pct||0, prm20=b20['PRM']?.pct||0;
  const pld24=b24['PLD']?.pct||0, pld20=b20['PLD']?.pct||0;

  const pm24:Record<string,Record<string,number>>={};
  prov24?.forEach((r:any)=>{ if(!pm24[r.provincia]) pm24[r.provincia]={val:Number(r.votos_validos)}; pm24[r.provincia][r.bloque]=Number(r.votos); });
  const pm20:Record<string,Record<string,number>>={};
  prov20?.forEach((r:any)=>{ if(!pm20[r.provincia]) pm20[r.provincia]={val:Number(r.votos_validos)}; pm20[r.provincia][r.bloque]=Number(r.votos); });

  const provincias = Object.keys(pm24).filter(n=>pm20[n]).map(nombre=>{
    const d24=pm24[nombre],d20=pm20[nombre];
    const fpPct24=(d24['FP']||0)/d24.val*100, fpPct20=(d20['FP']||0)/d20.val*100;
    const prmPct24=(d24['PRM']||0)/d24.val*100, prmPct20=(d20['PRM']||0)/d20.val*100;
    return { nombre, fpPct24, fpPct20, swingFp:fpPct24-fpPct20, prmPct24, prmPct20, swingPrm:prmPct24-prmPct20 };
  }).sort((a,b)=>b.swingFp-a.swingFp);

  const sc=(v:number)=>v>0?C.green:v<0?C.red:C.muted2;
  const sf=(v:number)=>`${v>=0?'+':''}${v.toFixed(1)}pp`;
  const s={background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'} as const;
  const h={display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1} as const;
  const th={padding:'.35rem .65rem',textAlign:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase' as const,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap' as const};
  const td=(e?:any)=>({padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',...e});

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Histórico Presidencial</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>2020 VS 2024</span>
        </div>
        <Link href="/dashboard" style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.72rem',textDecoration:'none',display:'flex',alignItems:'center'}}>← Dashboard</Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.6rem',marginBottom:'.85rem'}}>
        {[{partido:'FP',color:C.fp,p24:fp24,p20:fp20},{partido:'PRM',color:C.prm,p24:prm24,p20:prm20},{partido:'PLD',color:C.pld,p24:pld24,p20:pld20}].map(b=>(
          <div key={b.partido} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',padding:'.75rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:b.color}}/>
            <div style={{fontFamily:'monospace',fontSize:'.6rem',textTransform:'uppercase',letterSpacing:'.08em',color:C.muted,marginBottom:'.5rem'}}>{b.partido} · Presidencial</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'.5rem'}}>
              {[{label:'2024',val:b.p24,color:b.color},{label:'2020',val:b.p20,color:C.muted2},{label:'Swing',val:b.p24-b.p20,color:sc(b.p24-b.p20)}].map(col=>(
                <div key={col.label}>
                  <div style={{fontFamily:'monospace',fontSize:'.56rem',color:C.muted,marginBottom:'.2rem'}}>{col.label}</div>
                  <div style={{fontFamily:'monospace',fontSize:'1.1rem',fontWeight:600,color:col.color}}>{col.label==='Swing'?sf(col.val):`${col.val.toFixed(2)}%`}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={s}>
        <div style={h}>
          <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Swing por provincia — FP 2020→2024</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>{provincias.length} provincias · desc. swing FP</span>
        </div>
        <div style={{maxHeight:'520px',overflowY:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
            <thead><tr>
              <th style={th}>Provincia</th>
              <th style={{...th,textAlign:'right'}}>FP 2024</th><th style={{...th,textAlign:'right'}}>FP 2020</th>
              <th style={{...th,textAlign:'right',color:C.fp}}>Swing FP</th>
              <th style={{...th,textAlign:'right'}}>PRM 2024</th><th style={{...th,textAlign:'right'}}>PRM 2020</th>
              <th style={{...th,textAlign:'right'}}>Swing PRM</th>
            </tr></thead>
            <tbody>
              {provincias.map(p=>(
                <tr key={p.nombre}>
                  <td style={td({fontWeight:500})}>{p.nombre}</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{p.fpPct24.toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.muted2})}>{p.fpPct20.toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:sc(p.swingFp),fontWeight:600})}>{sf(p.swingFp)}</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.prm})}>{p.prmPct24.toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.muted2})}>{p.prmPct20.toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:sc(p.swingPrm)})}>{sf(p.swingPrm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
