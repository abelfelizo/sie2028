import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const C = {
  fp: '#e8294a', prm: '#1a6ae0', pld: '#7c3aed',
  green: '#10b981', amber: '#f59e0b', red: '#ef4444',
  text: '#dde1f0', muted: '#5a6185', muted2: '#7a85b0',
  bg1: '#0e1018', bg2: '#141720', bg3: '#1c2030', bg4: '#242840',
  border: '#252a3a', border2: '#2f3550',
};

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export default async function SenadoresPage() {
  const { data: prov2024 } = await supabase
    .from('v_senadores_provincia')
    .select('*')
    .eq('eleccion_id', 3)
    .order('provincia', { ascending: true });

  const { data: nac2024 } = await supabase
    .from('v_votos_bloque_nacional')
    .select('*')
    .eq('eleccion_id', 3)
    .eq('tipo_cargo', 'senador')
    .order('votos', { ascending: false });

  const bMap: Record<string, number> = {};
  let totalValidos = 0;
  nac2024?.forEach((b: any) => {
    bMap[b.bloque] = Number(b.votos);
    totalValidos = Number(b.votos_validos);
  });

  // Contar ganadores
  const ganadores: Record<string, number> = { PRM: 0, FP: 0, PLD: 0, Otros: 0 };
  prov2024?.forEach((p: any) => {
    if (p.ganador === 'PRM') ganadores.PRM++;
    else if (p.ganador === 'FP') ganadores.FP++;
    else if (p.ganador === 'PLD') ganadores.PLD++;
    else ganadores.Otros++;
  });

  const card = { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' };
  const hdr = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.55rem .8rem', borderBottom: `1px solid ${C.border}`, background: C.bg1 };
  const cardTitle = { fontFamily: 'monospace', fontSize: '.63rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.muted2 };
  const th = { padding: '.35rem .65rem', textAlign: 'left' as const, fontFamily: 'monospace', fontSize: '.58rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.muted, borderBottom: `1px solid ${C.border}`, background: C.bg1, whiteSpace: 'nowrap' as const };
  const td = (extra?: object) => ({ padding: '.32rem .65rem', borderBottom: `1px solid #ffffff05`, color: C.text, fontSize: '.74rem', ...extra });

  const bloqueColor = (b: string) => b === 'FP' ? C.fp : b === 'PRM' ? C.prm : b === 'PLD' ? C.pld : C.muted2;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Senadores 2024</span>
          <span style={{ fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border2}`, padding: '.1rem .35rem', borderRadius: '3px' }}>32 PROVINCIAS</span>
        </div>
        <Link href="/dashboard" style={{ fontSize: '.72rem', color: C.muted2, textDecoration: 'none' }}>← Dashboard</Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '.5rem', marginBottom: '.85rem' }}>
        {[
          { label: 'PRM gana', value: `${ganadores.PRM}/32`, sub: `${(ganadores.PRM/32*100).toFixed(0)}% del senado`, color: C.prm },
          { label: 'FP gana', value: `${ganadores.FP}/32`, sub: `${(ganadores.FP/32*100).toFixed(0)}% del senado`, color: C.fp },
          { label: 'PLD gana', value: `${ganadores.PLD}/32`, sub: `${(ganadores.PLD/32*100).toFixed(0)}% del senado`, color: C.pld },
          { label: 'Otros', value: `${ganadores.Otros}/32`, sub: 'Restantes', color: C.muted2 },
          { label: 'Votos FP', value: fmt(bMap['FP'] || 0), sub: `${totalValidos > 0 ? (bMap['FP']/totalValidos*100).toFixed(1) : 0}% del total`, color: C.fp },
          { label: 'Votos PRM', value: fmt(bMap['PRM'] || 0), sub: `${totalValidos > 0 ? (bMap['PRM']/totalValidos*100).toFixed(1) : 0}% del total`, color: C.prm },
        ].map(k => (
          <div key={k.label} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '.65rem .75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: k.color }}></div>
            <div style={{ fontFamily: 'monospace', fontSize: '.56rem', textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: '.3rem' }}>{k.label}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 600, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '.62rem', color: C.muted, marginTop: '.18rem' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Balance visual */}
      <div style={{ ...card, marginBottom: '.6rem' }}>
        <div style={hdr}>
          <span style={cardTitle}>Balance del Senado 2024</span>
          <span style={{ fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border}`, padding: '.06rem .35rem', borderRadius: '3px' }}>32 senadores</span>
        </div>
        <div style={{ padding: '.75rem' }}>
          <div style={{ height: '14px', display: 'flex', borderRadius: '4px', overflow: 'hidden', marginBottom: '.4rem' }}>
            <div style={{ flex: ganadores.PRM, background: C.prm, transition: 'flex .5s' }}></div>
            <div style={{ flex: ganadores.FP, background: C.fp }}></div>
            <div style={{ flex: ganadores.PLD, background: C.pld }}></div>
            <div style={{ flex: ganadores.Otros, background: C.muted }}></div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '.7rem' }}>
            {[
              { label: 'PRM', val: ganadores.PRM, color: C.prm },
              { label: 'FP', val: ganadores.FP, color: C.fp },
              { label: 'PLD', val: ganadores.PLD, color: C.pld },
              { label: 'Otros', val: ganadores.Otros, color: C.muted2 },
            ].map(b => (
              <span key={b.label}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: b.color, marginRight: '.3rem', verticalAlign: 'middle' }}></span>
                <span style={{ color: b.color, fontWeight: 600 }}>{b.label}</span>
                <span style={{ color: C.muted, marginLeft: '.3rem' }}>{b.val} senador{b.val !== 1 ? 'es' : ''}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla 32 provincias */}
      <div style={card}>
        <div style={hdr}>
          <span style={cardTitle}>Resultados por provincia — 2024</span>
          <span style={{ fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border}`, padding: '.06rem .35rem', borderRadius: '3px' }}>
            {prov2024?.length || 0} provincias
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.74rem' }}>
            <thead>
              <tr>
                <th style={th}>Provincia</th>
                <th style={{ ...th, textAlign: 'right' }}>FP %</th>
                <th style={{ ...th, textAlign: 'right' }}>PRM %</th>
                <th style={{ ...th, textAlign: 'right' }}>PLD %</th>
                <th style={{ ...th, textAlign: 'right' }}>Votos válidos</th>
                <th style={{ ...th, textAlign: 'center' }}>Ganador</th>
                <th style={{ ...th, textAlign: 'right' }}>Margen</th>
              </tr>
            </thead>
            <tbody>
              {prov2024?.map((p: any) => {
                const fpPct = Number(p.pct_fp) || 0;
                const prmPct = Number(p.pct_prm) || 0;
                const pldPct = Number(p.pct_pld) || 0;
                const ganColor = bloqueColor(p.ganador);
                const margenFp = fpPct - prmPct;
                return (
                  <tr key={p.provincia_id}>
                    <td style={td({ fontWeight: 500 })}>{p.provincia}</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.fp, fontWeight: 600 })}>{fpPct.toFixed(2)}%</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.prm })}>{prmPct.toFixed(2)}%</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.pld })}>{pldPct.toFixed(2)}%</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.muted2 })}>{fmt(Number(p.votos_validos) || 0)}</td>
                    <td style={td({ textAlign: 'center' })}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        fontFamily: 'monospace', fontSize: '.6rem', fontWeight: 600,
                        padding: '.1rem .4rem', borderRadius: '3px',
                        background: `${ganColor}18`,
                        color: ganColor,
                        border: `1px solid ${ganColor}30`
                      }}>{p.ganador}</span>
                    </td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: margenFp >= 0 ? C.green : C.red })}>
                      {margenFp >= 0 ? '+' : ''}{margenFp.toFixed(1)}pp
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
