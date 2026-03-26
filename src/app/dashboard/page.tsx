import { supabase } from '@/lib/supabase';
import { C, fmt, bloqueColor } from '@/lib/utils';
import { KpiCard, BarItem } from '@/components/ui';
import Link from 'next/link';

export const revalidate = 3600;

export default async function DashboardPage() {
  const [{ data: bloques }, { data: senBloques }, { data: encuestas }] = await Promise.all([
    supabase.from('v_votos_bloque_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente').order('votos',{ascending:false}),
    supabase.from('v_votos_bloque_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','senador').order('votos',{ascending:false}),
    supabase.from('encuestas').select('*').order('fecha',{ascending:false}).limit(3),
  ]);

  const bMap: Record<string,number> = {};
  let totalValidos = 0;
  bloques?.forEach((b:any) => { bMap[b.bloque]=Number(b.votos); totalValidos=Number(b.votos_validos); });

  const fp=bMap['FP']||0, prm=bMap['PRM']||0, pld=bMap['PLD']||0;
  const fpPct=totalValidos>0?fp/totalValidos*100:0;
  const prmPct=totalValidos>0?prm/totalValidos*100:0;
  const pldPct=totalValidos>0?pld/totalValidos*100:0;

  const senMap: Record<string,number>={};
  senBloques?.forEach((b:any)=>{ senMap[b.bloque]=Number(b.votos); });

  const s = { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:'10px', overflow:'hidden' } as const;
  const h = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.55rem .8rem', borderBottom:`1px solid ${C.border}`, background:C.bg1 } as const;
  const ct = { fontFamily:'monospace', fontSize:'.63rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase' as const, color:C.muted2 };
  const cb = { fontFamily:'monospace', fontSize:'.58rem', color:C.muted, background:C.bg3, border:`1px solid ${C.border}`, padding:'.06rem .35rem', borderRadius:'3px' };

  const encCalidad = (c:string) => c?.trim()==='A'
    ? { bg:'#10b98118', color:'#10b981', border:'1px solid #10b98130' }
    : { bg:'#f59e0b18', color:'#f59e0b', border:'1px solid #f59e0b30' };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.85rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.45rem' }}>
          <span style={{ fontSize:'1rem', fontWeight:600 }}>Dashboard</span>
          <span style={{ fontFamily:'monospace', fontSize:'.58rem', color:C.muted, background:C.bg3, border:`1px solid ${C.border2}`, padding:'.1rem .35rem', borderRadius:'3px' }}>ELECCIONES 2024</span>
        </div>
        <Link href="/presidencial" style={{ padding:'0 .65rem', height:'26px', background:C.bg3, border:`1px solid ${C.border2}`, borderRadius:'5px', color:C.muted2, fontSize:'.72rem', textDecoration:'none', display:'flex', alignItems:'center' }}>Ver presidencial →</Link>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'.5rem', marginBottom:'.85rem' }}>
        <KpiCard label="FP Bloque" value={`${fpPct.toFixed(2)}%`} sub={`${fmt(fp)} votos`} color={C.fp} />
        <KpiCard label="PRM Bloque" value={`${prmPct.toFixed(2)}%`} sub={`${fmt(prm)} votos`} color={C.prm} />
        <KpiCard label="PLD" value={`${pldPct.toFixed(2)}%`} sub={`${fmt(pld)} votos`} color={C.pld} />
        <KpiCard label="Votos válidos" value={fmt(totalValidos)} sub="Nivel nacional" color={C.green} />
        <KpiCard label="Margen PRM-FP" value={`${(prmPct-fpPct).toFixed(1)}pp`} sub="Brecha a cerrar" color={C.red} />
        <KpiCard label="Senadores FP" value="6/32" sub="PRM 23 · PLD 2" color={C.amber} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 1fr', gap:'.6rem' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.6rem' }}>
            {/* Resultado presidencial */}
            <div style={s}>
              <div style={h}><span style={ct}>Resultado presidencial 2024</span><span style={cb}>JCE oficial</span></div>
              <div style={{ padding:'.75rem' }}>
                <BarItem name="PRM · Luis Abinader" pct={prmPct} color={C.prm} />
                <BarItem name="FP · Leonel Fernández" pct={fpPct} color={C.fp} />
                <BarItem name="PLD · Gonzalo Castillo" pct={pldPct} color={C.pld} />
                {bloques?.filter((b:any)=>!['PRM','FP','PLD'].includes(b.bloque)).map((b:any)=>(
                  <BarItem key={b.bloque} name={b.bloque} pct={Number(b.pct)} color={C.muted} />
                ))}
              </div>
            </div>
            {/* Balance senado */}
            <div style={s}>
              <div style={h}><span style={ct}>Senado 2024</span><span style={cb}>32 senadores</span></div>
              <div style={{ padding:'.75rem' }}>
                {[{label:'PRM',val:23,color:C.prm},{label:'FP',val:6,color:C.fp},{label:'PLD',val:2,color:C.pld},{label:'Otros',val:1,color:C.muted2}].map(b=>(
                  <div key={b.label} style={{ marginBottom:'.5rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.15rem' }}>
                      <span style={{ fontSize:'.73rem', color:b.color, fontWeight:500 }}>{b.label}</span>
                      <span style={{ fontFamily:'monospace', fontSize:'.7rem', color:b.color }}>{b.val}/32</span>
                    </div>
                    <div style={{ height:'4px', background:C.bg4, borderRadius:'99px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${b.val/32*100}%`, background:b.color, borderRadius:'99px' }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:'.65rem', paddingTop:'.5rem', borderTop:`1px solid ${C.border}` }}>
                  <Link href="/senadores" style={{ fontSize:'.67rem', color:C.muted2, textDecoration:'none' }}>Ver 32 provincias →</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Brecha 2028 */}
          <div style={s}>
            <div style={h}><span style={ct}>Brecha electoral hacia 2028</span><span style={cb}>Base JCE 2024</span></div>
            <div style={{ padding:'.75rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.25rem', fontSize:'.72rem' }}>
                    <span>FP 2024: <strong style={{ color:C.fp }}>{fmt(fp)}</strong></span>
                    <span style={{ color:C.muted2 }}>Meta ~2.4M</span>
                  </div>
                  <div style={{ height:'7px', background:C.bg4, borderRadius:'99px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.min(fp/2400000*100,100)}%`, background:`linear-gradient(90deg,#7a1428,${C.fp})`, borderRadius:'99px' }} />
                  </div>
                  <div style={{ fontSize:'.65rem', color:C.muted, marginTop:'.25rem' }}>{(fp/2400000*100).toFixed(1)}% del objetivo</div>
                </div>
                <div>
                  {[
                    {label:'① Alianza FP+PLD',val:'~357K',color:C.green},
                    {label:'② Nuevos electores',val:'~222K',color:C.prm},
                    {label:'③ Movilización abs.',val:'~117K',color:C.amber},
                    {label:'④ Transferencia PLD',val:'~37K',color:C.pld},
                  ].map(f=>(
                    <div key={f.label} style={{ display:'flex', justifyContent:'space-between', padding:'.2rem 0', borderBottom:`1px solid #ffffff06`, fontSize:'.72rem' }}>
                      <span style={{ color:C.muted2 }}>{f.label}</span>
                      <span style={{ fontFamily:'monospace', fontWeight:600, color:f.color }}>{f.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navegación rápida */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'.5rem' }}>
            {[
              { href:'/presidencial', icon:'▣', label:'Presidencial', sub:'32 provincias' },
              { href:'/senadores', icon:'▢', label:'Senadores', sub:'Ganadores prov.' },
              { href:'/diputados', icon:'▦', label:'Diputados', sub:'32 provincias' },
              { href:'/historico', icon:'◌', label:'Histórico 2020', sub:'Swing comparativo' },
            ].map(l=>(
              <Link key={l.href} href={l.href} style={{ display:'block', padding:'.55rem .6rem', borderRadius:'8px', background:C.bg3, border:`1px solid ${C.border2}`, textDecoration:'none' }}>
                <div style={{ fontSize:'.85rem', marginBottom:'.2rem' }}>{l.icon}</div>
                <div style={{ fontSize:'.73rem', color:C.text, fontWeight:500 }}>{l.label}</div>
                <div style={{ fontSize:'.62rem', color:C.muted2, marginTop:'.1rem' }}>{l.sub}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Columna derecha */}
        <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
          <div style={s}>
            <div style={h}><span style={ct}>Encuestas recientes</span><Link href="/encuestas" style={{ fontFamily:'monospace', fontSize:'.55rem', color:C.fp, textDecoration:'none' }}>Ver todas →</Link></div>
            {encuestas?.map((enc:any)=>{
              const q = encCalidad(enc.calidad);
              const fpVal=Number(enc.fp_pct)||0, prmVal=Number(enc.prm_pct)||0, pldVal=Number(enc.pld_pct)||0;
              const total=fpVal+prmVal+pldVal||1;
              return (
                <div key={enc.id} style={{ padding:'.6rem .75rem', borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.2rem' }}>
                    <span style={{ fontSize:'.78rem', fontWeight:600 }}>{enc.firma}</span>
                    <span style={{ fontFamily:'monospace', fontSize:'.55rem', padding:'.05rem .28rem', borderRadius:'3px', background:q.bg, color:q.color, border:q.border }}>{enc.calidad?.trim()}</span>
                  </div>
                  <div style={{ fontSize:'.63rem', color:C.muted, marginBottom:'.3rem' }}>{enc.fecha} · {enc.tipo?.replace('_',' ')} · N={enc.n_muestra?.toLocaleString()}</div>
                  <div style={{ display:'flex', gap:'3px', height:'3px', marginBottom:'.28rem' }}>
                    <div style={{ flex:prmVal/total, background:C.prm, borderRadius:'2px' }} />
                    <div style={{ flex:fpVal/total, background:C.fp, borderRadius:'2px' }} />
                    <div style={{ flex:pldVal/total, background:C.pld, borderRadius:'2px' }} />
                  </div>
                  <div style={{ display:'flex', gap:'.5rem', fontFamily:'monospace', fontSize:'.6rem' }}>
                    <span style={{ color:C.prm }}>PRM {prmVal.toFixed(1)}%</span>
                    <span style={{ color:C.fp }}>FP {fpVal.toFixed(1)}%</span>
                    <span style={{ color:C.pld }}>PLD {pldVal.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
