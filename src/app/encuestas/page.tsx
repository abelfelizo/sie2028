import { supabase } from '@/lib/supabase';
import { C, fmt } from '@/lib/utils';
import { KpiCard } from '@/components/ui';
import Link from 'next/link';

export const revalidate = 3600;

export default async function EncuestasPage() {
  const { data: encuestas } = await supabase
    .from('encuestas').select('*').order('fecha', { ascending: true });

  const intencion = encuestas?.filter((e: any) => e.tipo === 'intencion_candidato') || [];
  const simpatia = encuestas?.filter((e: any) => e.tipo === 'simpatia_partidaria') || [];

  const ultima = encuestas?.[encuestas.length - 1];
  const penultima = encuestas?.[encuestas.length - 2];
  const fpTrend = ultima && penultima ? Number(ultima.fp_pct) - Number(penultima.fp_pct) : 0;
  const prmTrend = ultima && penultima ? Number(ultima.prm_pct) - Number(penultima.prm_pct) : 0;

  const s = { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' } as const;
  const h = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.55rem .8rem', borderBottom: `1px solid ${C.border}`, background: C.bg1 } as const;
  const ct = { fontFamily: 'monospace', fontSize: '.63rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.muted2 };
  const cb = { fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border}`, padding: '.06rem .35rem', borderRadius: '3px' };
  const th = { padding: '.35rem .65rem', textAlign: 'left' as const, fontFamily: 'monospace', fontSize: '.58rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.muted, borderBottom: `1px solid ${C.border}`, background: C.bg1, whiteSpace: 'nowrap' as const };
  const td = (e?: any) => ({ padding: '.35rem .65rem', borderBottom: `1px solid #ffffff05`, color: C.text, fontSize: '.74rem', ...e });

  const calBadge = (c: string) => c?.trim() === 'A'
    ? { bg: '#10b98118', color: '#10b981', border: '1px solid #10b98130' }
    : { bg: '#f59e0b18', color: '#f59e0b', border: '1px solid #f59e0b30' };

  const tipoLabel = (t: string) => t === 'intencion_candidato' ? 'Intención' : 'Simpatía';

  // Construir puntos para SVG del gráfico de tendencia
  // Usamos sólo encuestas con datos (todas las 6)
  const all = encuestas || [];
  const W = 560, H = 140, PAD = { l: 30, r: 10, t: 15, b: 20 };
  const vals = all.map((e: any) => ({ fp: Number(e.fp_pct), prm: Number(e.prm_pct), pld: Number(e.pld_pct) }));
  const allVals = vals.flatMap(v => [v.fp, v.prm, v.pld]);
  const minV = Math.floor(Math.min(...allVals) - 2);
  const maxV = Math.ceil(Math.max(...allVals) + 2);
  const xStep = all.length > 1 ? (W - PAD.l - PAD.r) / (all.length - 1) : 0;
  const yScale = (v: number) => PAD.t + (H - PAD.t - PAD.b) * (1 - (v - minV) / (maxV - minV));
  const xAt = (i: number) => PAD.l + i * xStep;

  const polyline = (key: 'fp' | 'prm' | 'pld') =>
    vals.map((v, i) => `${xAt(i).toFixed(1)},${yScale(v[key]).toFixed(1)}`).join(' ');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Encuestas</span>
          <span style={{ fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border2}`, padding: '.1rem .35rem', borderRadius: '3px' }}>{encuestas?.length || 0} REGISTROS</span>
        </div>
        <Link href="/dashboard" style={{ padding: '0 .65rem', height: '26px', background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: '5px', color: C.muted2, fontSize: '.72rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>← Dashboard</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem', marginBottom: '.85rem' }}>
        <KpiCard label="Última FP" value={`${Number(ultima?.fp_pct || 0).toFixed(1)}%`} sub={`${fpTrend >= 0 ? '+' : ''}${fpTrend.toFixed(1)}pp vs anterior`} color={C.fp} />
        <KpiCard label="Última PRM" value={`${Number(ultima?.prm_pct || 0).toFixed(1)}%`} sub={`${prmTrend >= 0 ? '+' : ''}${prmTrend.toFixed(1)}pp vs anterior`} color={C.prm} />
        <KpiCard label="Encuestas intención" value={`${intencion.length}`} sub="Candidato presidencial" color={C.amber} />
        <KpiCard label="Encuestas simpatía" value={`${simpatia.length}`} sub="Partido" color={C.muted2} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginBottom: '.6rem' }}>
        {/* Tabla */}
        <div style={s}>
          <div style={h}><span style={ct}>Registro completo</span><span style={cb}>Ene–Mar 2026</span></div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.74rem' }}>
            <thead>
              <tr>
                <th style={th}>Fecha</th>
                <th style={th}>Firma</th>
                <th style={th}>Tipo</th>
                <th style={{ ...th, textAlign: 'right' }}>PRM</th>
                <th style={{ ...th, textAlign: 'right' }}>FP</th>
                <th style={{ ...th, textAlign: 'right' }}>PLD</th>
                <th style={{ ...th, textAlign: 'center' }}>Cal.</th>
              </tr>
            </thead>
            <tbody>
              {[...(encuestas || [])].reverse().map((e: any) => {
                const q = calBadge(e.calidad);
                return (
                  <tr key={e.id}>
                    <td style={td({ fontFamily: 'monospace', fontSize: '.7rem', color: C.muted2 })}>{e.fecha}</td>
                    <td style={td({ fontWeight: 500 })}>{e.firma}</td>
                    <td style={td({ fontSize: '.68rem', color: C.muted2 })}>{tipoLabel(e.tipo)}</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.prm, fontWeight: 600 })}>{Number(e.prm_pct).toFixed(1)}%</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.fp, fontWeight: 600 })}>{Number(e.fp_pct).toFixed(1)}%</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.pld })}>{Number(e.pld_pct).toFixed(1)}%</td>
                    <td style={td({ textAlign: 'center' })}>
                      <span style={{ fontFamily: 'monospace', fontSize: '.6rem', fontWeight: 700, padding: '.08rem .3rem', borderRadius: '3px', background: q.bg, color: q.color, border: q.border }}>{e.calidad?.trim()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Gráfico SVG */}
        <div style={s}>
          <div style={h}><span style={ct}>Tendencia FP vs PRM</span><span style={cb}>Ene–Mar 2026</span></div>
          <div style={{ padding: '.75rem' }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
              {/* Grid lines */}
              {[minV, Math.round((minV + maxV) / 2), maxV].map(v => (
                <g key={v}>
                  <line x1={PAD.l} y1={yScale(v)} x2={W - PAD.r} y2={yScale(v)} stroke="#252a3a" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x={PAD.l - 4} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fill="#5a6185" fontSize="8" fontFamily="monospace">{v}%</text>
                </g>
              ))}
              {/* Axis */}
              <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#2f3550" strokeWidth="0.5" />
              <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#2f3550" strokeWidth="0.5" />
              {/* PRM line */}
              <polyline points={polyline('prm')} fill="none" stroke={C.prm} strokeWidth="1.5" strokeLinejoin="round" />
              {/* FP line */}
              <polyline points={polyline('fp')} fill="none" stroke={C.fp} strokeWidth="2" strokeLinejoin="round" />
              {/* PLD line */}
              <polyline points={polyline('pld')} fill="none" stroke={C.pld} strokeWidth="1" strokeLinejoin="round" strokeDasharray="4,2" />
              {/* Points FP */}
              {vals.map((v, i) => (
                <circle key={i} cx={xAt(i)} cy={yScale(v.fp)} r="3" fill={C.fp} />
              ))}
              {/* Points PRM */}
              {vals.map((v, i) => (
                <circle key={i} cx={xAt(i)} cy={yScale(v.prm)} r="3" fill={C.prm} />
              ))}
              {/* Labels en el último punto */}
              {vals.length > 0 && (
                <>
                  <text x={xAt(vals.length - 1) + 5} y={yScale(vals[vals.length - 1].prm)} dominantBaseline="middle" fill={C.prm} fontSize="8" fontFamily="monospace">PRM</text>
                  <text x={xAt(vals.length - 1) + 5} y={yScale(vals[vals.length - 1].fp)} dominantBaseline="middle" fill={C.fp} fontSize="8" fontFamily="monospace">FP</text>
                </>
              )}
              {/* Fechas eje X */}
              {all.map((e: any, i: number) => (
                <text key={i} x={xAt(i)} y={H - 4} textAnchor="middle" fill="#5a6185" fontSize="7" fontFamily="monospace">
                  {e.fecha?.slice(5)}
                </text>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '.5rem', fontSize: '.68rem', justifyContent: 'center' }}>
              {[{ label: 'PRM', color: C.prm }, { label: 'FP', color: C.fp }, { label: 'PLD (---)', color: C.pld }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  <span style={{ display: 'inline-block', width: '14px', height: '2px', background: l.color, borderRadius: '1px' }} />
                  <span style={{ color: l.color }}>{l.label}</span>
                </span>
              ))}
            </div>
            <div style={{ fontSize: '.62rem', color: C.muted, textAlign: 'center', marginTop: '.3rem' }}>Incluye simpatía e intención · Ene–Mar 2026</div>
          </div>
        </div>
      </div>

      {/* Cards individuales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.5rem' }}>
        {[...(encuestas || [])].reverse().map((e: any) => {
          const fp = Number(e.fp_pct), prm = Number(e.prm_pct), pld = Number(e.pld_pct);
          const total = fp + prm + pld || 1;
          const q = calBadge(e.calidad);
          return (
            <div key={e.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '.65rem .75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.2rem' }}>
                <span style={{ fontWeight: 600, fontSize: '.82rem' }}>{e.firma}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '.58rem', fontWeight: 700, padding: '.06rem .3rem', borderRadius: '3px', background: q.bg, color: q.color, border: q.border }}>{e.calidad?.trim()}</span>
              </div>
              <div style={{ fontSize: '.63rem', color: C.muted, marginBottom: '.4rem' }}>{e.fecha} · {tipoLabel(e.tipo)} · N={Number(e.n_muestra).toLocaleString()}</div>
              <div style={{ display: 'flex', height: '5px', borderRadius: '3px', overflow: 'hidden', marginBottom: '.4rem', gap: '1px' }}>
                <div style={{ flex: prm / total, background: C.prm }} />
                <div style={{ flex: fp / total, background: C.fp }} />
                <div style={{ flex: pld / total, background: C.pld }} />
              </div>
              <div style={{ display: 'flex', gap: '.6rem', fontFamily: 'monospace', fontSize: '.65rem' }}>
                <span style={{ color: C.prm, fontWeight: 600 }}>PRM {prm.toFixed(1)}%</span>
                <span style={{ color: C.fp, fontWeight: 600 }}>FP {fp.toFixed(1)}%</span>
                <span style={{ color: C.pld }}>PLD {pld.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
