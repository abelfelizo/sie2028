import { supabase } from '@/lib/supabase';
import { C, fmt, bloqueColor } from '@/lib/utils';
import { KpiCard } from '@/components/ui';
import Link from 'next/link';

export const revalidate = 3600;

export default async function HistoricoPage() {
  const [{ data: nac2024 }, { data: nac2020 }, { data: prov2024 }, { data: prov2020 }] = await Promise.all([
    supabase.from('v_votos_bloque_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente'),
    supabase.from('v_votos_bloque_nacional').select('*').eq('eleccion_id',1).eq('tipo_cargo','presidente'),
    supabase.from('v_votos_bloque_provincia').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente'),
    supabase.from('v_votos_bloque_provincia').select('*').eq('eleccion_id',1).eq('tipo_cargo','presidente'),
  ]);

  const toMap = (data: any[]) => {
    const m: Record<string,{votos:number,pct:number,validos:number}> = {};
    data?.forEach((b:any)=>{ m[b.bloque]={votos:Number(b.votos),pct:Number(b.pct),validos:Number(b.votos_validos)}; });
    return m;
  };
  const b24=toMap(nac2024||[]), b20=toMap(nac2020||[]);

  // Pivot por provincia para ambos años
  const pMap: Record<string,Record<string,number>> = {};
  prov2024?.forEach((r:any)=>{ if(!pMap[r.provincia]) pMap[r.provincia]={validos24:Number(r.votos_validos)}; pMap[r.provincia][`${r.bloque}24`]=Number(r.votos); });
  prov2020?.forEach((r:any)=>{ if(!pMap[r.provincia]) pMap[r.provincia]={}; pMap[r.provincia].validos20=Number(r.votos_validos); pMap[r.provincia][`${r.bloque}20`]=Number(r.votos); });

  const provincias = Object.entries(pMap).map(([nombre,d])=>{
    const fp24=d.FP24||0, fp20=d.FP20||0;
    const prm24=d.PRM24||0, prm20=d.PRM20||0;
    const v24=d.validos24||1, v20=d.validos20||1;
    const fpPct24=fp24/v24*100, fpPct20=fp20/v20*100;
    const prmPct24=prm24/v24*100, prmPct20=prm20/v20*100;
    return { nombre, fpPct24, fpPct20, swingFp:fpPct24-fpPct20, prmPct24, prmPct20, swingPrm:prmPct24-prmPct20 };
  }).filter(p=>p.fpPct20>0).sort((a,b)=>b.swingFp-a.swingFp);

  const fp24=b24['FP']?.pct||0, fp20=b20['FP']?.pct||0;
  const prm24=b24['PRM']?.pct||0, prm20=b20['PRM']?.pct||0;
  const pld24=b24['PLD']?.pct||0, pld20=b20['PLD']?.pct||0;

  const s = { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:'10px', overflow:'hidden' } as const;
  const h = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.55rem .8rem', borderBottom:`1px solid ${C.border}`, background:C.bg1 } as const;
  const ct = { fontFamily:'monospace', fontSize:'.63rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase' as const, color:C.muted2 };
  const cb = { fontFamily:'monospace', fontSize:'.58rem', color:C.muted, background:C.bg3, border:`1px solid ${C.border}`, padding:'.06rem .35rem', borderRadius:'3px' };
  const th = { padding:'.35rem .65rem', textAlign:'left' as const, fontFamily:'monospace', fontSize:'.58rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase' as const, color:C.muted, borderBottom:`1px solid ${C.border}`, background:C.bg1, whiteSpace:'nowrap' as const };
  const td = (e?:any) => ({ padding:'.32rem .65rem', borderBottom:`1px solid #ffffff05`, color:C.text, fontSize:'.74rem', ...e });

  const swingColor=(v:number)=>v>0?C.green:v<0?C.red:C.muted2;
  const swingFmt=(v:number)=>`${v>=0?'+':''}${v.toFixed(1)}pp`;

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.85rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.45rem' }}>
          <span style={{ fontSize:'1rem', fontWeight:600 }}>Histórico Presidencial</span>
          <span style={{ fontFamily:'monospace', fontSize:'.58rem', color:C.muted, background:C.bg3, border:`1px solid ${C.border2}`, padding:'.1rem .35rem', borderRadius:'3px' }}>2020 vs 2024</span>
        </div>
        <Link href="/dashboard" style={{ padding:'0 .65rem', height:'26px', background:C.bg3, border:`1px solid ${C.border2}`, borderRadius:'5px', color:C.muted2, fontSize:'.72rem', textDecoration:'none', display:'flex', alignItems:'center' }}>← Dashboard</Link>
      </div>

      {/* KPIs comparativos */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.6rem', marginBottom:'.85rem' }}>
        {[
          { partido:'FP', pct24:fp24, pct20:fp20, color:C.fp },
          { partido:'PRM', pct24:prm24, pct20:prm20, color:C.prm },
          { partido:'PLD', pct24:pld24, pct20:pld20, color:C.pld },
        ].map(b=>(
          <div key={b.partido} style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'.75rem', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:b.color }} />
            <div style={{ fontFamily:'monospace', fontSize:'.6rem', textTransform:'uppercase', letterSpacing:'.08em', color:C.muted, marginBottom:'.5rem' }}>{b.partido} · Presidencial</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'.5rem' }}>
              <div>
                <div style={{ fontFamily:'monospace', fontSize:'.56rem', color:C.muted, marginBottom:'.2rem' }}>2024</div>
                <div style={{ fontFamily:'monospace', fontSize:'1.1rem', fontWeight:600, color:b.color }}>{b.pct24.toFixed(2)}%</div>
              </div>
              <div>
                <div style={{ fontFamily:'monospace', fontSize:'.56rem', color:C.muted, marginBottom:'.2rem' }}>2020</div>
                <div style={{ fontFamily:'monospace', fontSize:'1.1rem', fontWeight:600, color:C.muted2 }}>{b.pct20.toFixed(2)}%</div>
              </div>
              <div>
                <div style={{ fontFamily:'monospace', fontSize:'.56rem', color:C.muted, marginBottom:'.2rem' }}>Swing</div>
                <div style={{ fontFamily:'monospace', fontSize:'1.1rem', fontWeight:600, color:swingColor(b.pct24-b.pct20) }}>{swingFmt(b.pct24-b.pct20)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla swing por provincia */}
      <div style={s}>
        <div style={h}>
          <span style={ct}>Swing por provincia — FP 2020→2024</span>
          <span style={cb}>{provincias.length} provincias · ordenado por swing FP</span>
        </div>
        <div style={{ maxHeight:'520px', overflowY:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.74rem' }}>
            <thead>
              <tr>
                <th style={th}>Provincia</th>
                <th style={{ ...th, textAlign:'right' }}>FP 2024</th>
                <th style={{ ...th, textAlign:'right' }}>FP 2020</th>
                <th style={{ ...th, textAlign:'right', color:C.fp }}>Swing FP</th>
                <th style={{ ...th, textAlign:'right' }}>PRM 2024</th>
                <th style={{ ...th, textAlign:'right' }}>PRM 2020</th>
                <th style={{ ...th, textAlign:'right' }}>Swing PRM</th>
              </tr>
            </thead>
            <tbody>
              {provincias.map((p)=>(
                <tr key={p.nombre}>
                  <td style={td({fontWeight:500})}>{p.nombre}</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.fp,fontWeight:600})}>{p.fpPct24.toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.muted2})}>{p.fpPct20.toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:swingColor(p.swingFp),fontWeight:600})}>{swingFmt(p.swingFp)}</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.prm})}>{p.prmPct24.toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:C.muted2})}>{p.prmPct20.toFixed(1)}%</td>
                  <td style={td({textAlign:'right',fontFamily:'monospace',color:swingColor(p.swingPrm)})}>{swingFmt(p.swingPrm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
