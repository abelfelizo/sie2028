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
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(3) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export default async function PresidencialPage() {
  // Bloques nacionales
  const { data: bloquesNac } = await supabase
    .from('v_votos_bloque_nacional')
    .select('*')
    .eq('eleccion_id', 3)
    .eq('tipo_cargo', 'presidente')
    .order('votos', { ascending: false });

  // Por provincia — pivot manual
  const { data: porProv } = await supabase
    .from('v_votos_bloque_provincia')
    .select('*')
    .eq('eleccion_id', 3)
    .eq('tipo_cargo', 'presidente')
    .order('provincia', { ascending: true });

  // Partidos individuales nacionales
  const { data: partidos } = await supabase
    .from('v_votos_nacional')
    .select('*')
    .eq('eleccion_id', 3)
    .eq('tipo_cargo', 'presidente')
    .order('votos', { ascending: false });

  // Procesar bloques nacionales
  const bMap: Record<string, { votos: number; pct: number; validos: number }> = {};
  let totalValidos = 0;
  bloquesNac?.forEach((b: any) => {
    bMap[b.bloque] = { votos: Number(b.votos), pct: Number(b.pct), validos: Number(b.votos_validos) };
    totalValidos = Number(b.votos_validos);
  });

  // Pivot provincias: { provincia: { FP, PRM, PLD, validos } }
  const provMap: Record<string, Record<string, number>> = {};
  porProv?.forEach((r: any) => {
    if (!provMap[r.provincia]) provMap[r.provincia] = { validos: Number(r.votos_validos), provincia_id: r.provincia_id };
    provMap[r.provincia][r.bloque] = Number(r.votos);
  });

  const provincias = Object.entries(provMap).map(([nombre, d]) => {
    const fp = d['FP'] || 0;
    const prm = d['PRM'] || 0;
    const pld = d['PLD'] || 0;
    const val = d['validos'] || 1;
    const margen = ((fp / val) - (prm / val)) * 100;
    return { nombre, fp, prm, pld, validos: val, fp_pct: fp/val*100, prm_pct: prm/val*100, pld_pct: pld/val*100, margen };
  }).sort((a, b) => b.fp_pct - a.fp_pct);

  const card = { background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' };
  const hdr = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.55rem .8rem', borderBottom: `1px solid ${C.border}`, background: C.bg1 };
  const th = { padding: '.35rem .65rem', textAlign: 'left' as const, fontFamily: 'monospace', fontSize: '.58rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.muted, borderBottom: `1px solid ${C.border}`, background: C.bg1, whiteSpace: 'nowrap' as const };
  const td = (extra?: object) => ({ padding: '.32rem .65rem', borderBottom: `1px solid #ffffff05`, color: C.text, fontSize: '.74rem', ...extra });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Presidencial 2024</span>
          <span style={{ fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border2}`, padding: '.1rem .35rem', borderRadius: '3px' }}>MAYO 19</span>
        </div>
        <Link href="/dashboard" style={{ fontSize: '.72rem', color: C.muted2, textDecoration: 'none' }}>← Dashboard</Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '.5rem', marginBottom: '.85rem' }}>
        {[
          { label: 'PRM Bloque', value: `${(bMap['PRM']?.pct || 0).toFixed(2)}%`, sub: fmt(bMap['PRM']?.votos || 0) + ' votos', color: C.prm },
          { label: 'FP Bloque', value: `${(bMap['FP']?.pct || 0).toFixed(2)}%`, sub: fmt(bMap['FP']?.votos || 0) + ' votos', color: C.fp },
          { label: 'PLD', value: `${(bMap['PLD']?.pct || 0).toFixed(2)}%`, sub: fmt(bMap['PLD']?.votos || 0) + ' votos', color: C.pld },
          { label: 'Votos válidos', value: fmt(totalValidos), sub: 'Nivel nacional', color: C.green },
          { label: 'Margen PRM-FP', value: `${((bMap['PRM']?.pct || 0) - (bMap['FP']?.pct || 0)).toFixed(1)}pp`, sub: 'Diferencia bloques', color: C.red },
          { label: 'Participantes', value: `${provincias.length}`, sub: 'Provincias', color: C.amber },
        ].map(k => (
          <div key={k.label} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '.65rem .75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: k.color }}></div>
            <div style={{ fontFamily: 'monospace', fontSize: '.56rem', textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: '.3rem' }}>{k.label}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 600, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '.62rem', color: C.muted, marginTop: '.18rem' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '.6rem', marginBottom: '.6rem' }}>
        {/* Tabla provincias */}
        <div style={card}>
          <div style={hdr}>
            <span style={{ fontFamily: 'monospace', fontSize: '.63rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted2 }}>Resultados por provincia</span>
            <span style={{ fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border}`, padding: '.06rem .35rem', borderRadius: '3px' }}>
              {provincias.length} provincias · ordenado por FP%
            </span>
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.74rem' }}>
              <thead>
                <tr>
                  <th style={th}>Provincia</th>
                  <th style={{ ...th, textAlign: 'right' }}>FP %</th>
                  <th style={{ ...th, textAlign: 'right' }}>PRM %</th>
                  <th style={{ ...th, textAlign: 'right' }}>PLD %</th>
                  <th style={{ ...th, textAlign: 'right' }}>Margen</th>
                  <th style={th}>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {provincias.map((p) => (
                  <tr key={p.nombre} style={{ cursor: 'default' }}>
                    <td style={td()}>{p.nombre}</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.fp, fontWeight: 600 })}>{p.fp_pct.toFixed(2)}%</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.prm })}>{p.prm_pct.toFixed(2)}%</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: C.pld })}>{p.pld_pct.toFixed(2)}%</td>
                    <td style={td({ textAlign: 'right', fontFamily: 'monospace', color: p.margen >= 0 ? C.green : C.red })}>
                      {p.margen >= 0 ? '+' : ''}{p.margen.toFixed(1)}pp
                    </td>
                    <td style={td()}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        fontFamily: 'monospace', fontSize: '.58rem', fontWeight: 600,
                        padding: '.08rem .3rem', borderRadius: '3px',
                        background: p.prm_pct > p.fp_pct ? '#1a6ae018' : '#e8294a18',
                        color: p.prm_pct > p.fp_pct ? C.prm : C.fp,
                        border: `1px solid ${p.prm_pct > p.fp_pct ? '#1a6ae030' : '#e8294a30'}`
                      }}>
                        {p.prm_pct > p.fp_pct ? 'PRM' : 'FP'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {/* Barras bloques */}
          <div style={card}>
            <div style={hdr}>
              <span style={{ fontFamily: 'monospace', fontSize: '.63rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted2 }}>Bloques electorales</span>
            </div>
            <div style={{ padding: '.75rem' }}>
              {bloquesNac?.map((b: any) => (
                <div key={b.bloque} style={{ marginBottom: '.55rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.18rem' }}>
                    <span style={{ fontSize: '.73rem', fontWeight: 500, color: b.bloque === 'FP' ? C.fp : b.bloque === 'PRM' ? C.prm : b.bloque === 'PLD' ? C.pld : C.muted2 }}>
                      {b.bloque}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '.7rem', color: C.muted2 }}>{Number(b.pct).toFixed(2)}%</span>
                  </div>
                  <div style={{ height: '5px', background: C.bg4, borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(Number(b.pct), 100)}%`, background: b.bloque === 'FP' ? C.fp : b.bloque === 'PRM' ? C.prm : b.bloque === 'PLD' ? C.pld : C.muted, borderRadius: '99px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 partidos */}
          <div style={card}>
            <div style={hdr}>
              <span style={{ fontFamily: 'monospace', fontSize: '.63rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted2 }}>Por partido (sin agrupar)</span>
              <span style={{ fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border}`, padding: '.06rem .35rem', borderRadius: '3px' }}>
                Top {partidos?.length || 0}
              </span>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {partidos?.map((p: any) => (
                <div key={p.partido} style={{ display: 'flex', justifyContent: 'space-between', padding: '.3rem .75rem', borderBottom: `1px solid #ffffff06`, fontSize: '.73rem' }}>
                  <span style={{ color: C.muted2 }}>
                    <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: p.partido === 'FP' ? C.fp : p.partido === 'PRM' ? C.prm : p.partido === 'PLD' ? C.pld : C.muted, marginRight: '.35rem', verticalAlign: 'middle' }}></span>
                    {p.partido}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '.72rem', fontWeight: 600 }}>
                    {(Number(p.votos) / totalValidos * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
