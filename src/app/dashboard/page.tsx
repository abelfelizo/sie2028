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
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

function fmtPct(n: string | number) { return Number(n).toFixed(2) + '%'; }

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '6px',
      padding: '.65rem .75rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }}></div>
      <div style={{ fontFamily: 'monospace', fontSize: '.56rem', textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: '.3rem' }}>{label}</div>
      <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '.62rem', color: C.muted, marginTop: '.18rem' }}>{sub}</div>
    </div>
  );
}

function BarItem({ name, pct, color }: { name: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: '.55rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.18rem' }}>
        <span style={{ fontSize: '.73rem', fontWeight: 500, color }}>{name}</span>
        <span style={{ fontFamily: 'monospace', fontSize: '.7rem', color: C.muted2 }}>{pct.toFixed(2)}%</span>
      </div>
      <div style={{ height: '5px', background: C.bg4, borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: '99px' }}></div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  // KPIs presidencial 2024
  const { data: bloques } = await supabase
    .from('v_votos_bloque_nacional')
    .select('*')
    .eq('eleccion_id', 3)
    .eq('tipo_cargo', 'presidente')
    .order('votos', { ascending: false });

  // KPIs senadores 2024
  const { data: senadoresNac } = await supabase
    .from('v_votos_bloque_nacional')
    .select('*')
    .eq('eleccion_id', 3)
    .eq('tipo_cargo', 'senador')
    .order('votos', { ascending: false });

  // Encuestas recientes
  const { data: encuestas } = await supabase
    .from('encuestas')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(3);

  const bloquesMap: Record<string, number> = {};
  let totalValidos = 0;
  let totalEmitidos = 0;
  if (bloques) {
    bloques.forEach((b: any) => {
      bloquesMap[b.bloque] = Number(b.votos);
      totalValidos = Number(b.votos_validos);
      totalEmitidos = totalValidos; // approx
    });
  }

  const fpVotos = bloquesMap['FP'] || 0;
  const prmVotos = bloquesMap['PRM'] || 0;
  const pldVotos = bloquesMap['PLD'] || 0;
  const fpPct = totalValidos > 0 ? (fpVotos / totalValidos * 100) : 0;
  const prmPct = totalValidos > 0 ? (prmVotos / totalValidos * 100) : 0;
  const pldPct = totalValidos > 0 ? (pldVotos / totalValidos * 100) : 0;

  // Senadores por bloque 2024
  const senMap: Record<string, number> = {};
  if (senadoresNac) senadoresNac.forEach((b: any) => { senMap[b.bloque] = Number(b.votos); });

  const card = {
    background: C.bg2, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden'
  };
  const hdr = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '.55rem .8rem', borderBottom: `1px solid ${C.border}`, background: C.bg1
  };
  const cardTitle = { fontFamily: 'monospace', fontSize: '.63rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: C.muted2 };
  const cardBadge = { fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border}`, padding: '.06rem .35rem', borderRadius: '3px' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Dashboard</span>
          <span style={{ fontFamily: 'monospace', fontSize: '.58rem', color: C.muted, background: C.bg3, border: `1px solid ${C.border2}`, padding: '.1rem .35rem', borderRadius: '3px' }}>ELECCIONES 2024</span>
        </div>
        <Link href="/presidencial" style={{ padding: '0 .65rem', height: '26px', background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: '5px', color: C.muted2, fontSize: '.72rem', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          Ver presidencial →
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '.5rem', marginBottom: '.85rem' }}>
        <KpiCard label="FP Bloque" value={fmtPct(fpPct)} sub={`${fmt(fpVotos)} votos`} color={C.fp} />
        <KpiCard label="PRM Bloque" value={fmtPct(prmPct)} sub={`${fmt(prmVotos)} votos`} color={C.prm} />
        <KpiCard label="PLD" value={fmtPct(pldPct)} sub={`${fmt(pldVotos)} votos`} color={C.pld} />
        <KpiCard label="Válidos" value={fmt(totalValidos)} sub="Votos válidos" color={C.green} />
        <KpiCard label="Margen vs FP" value={`${(prmPct - fpPct).toFixed(1)}pp`} sub="PRM sobre FP" color={C.red} />
        <KpiCard label="Senadores PRM" value="23/32" sub="FP: 6 · PLD: 2" color={C.amber} />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '.6rem' }}>
        {/* Columna izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {/* Resultado presidencial */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
            <div style={card}>
              <div style={hdr}>
                <span style={cardTitle}>Resultado presidencial 2024</span>
                <span style={cardBadge}>Por bloque · JCE</span>
              </div>
              <div style={{ padding: '.75rem' }}>
                <BarItem name="PRM · Luis Abinader" pct={prmPct} color={C.prm} />
                <BarItem name="FP · Leonel Fernández" pct={fpPct} color={C.fp} />
                <BarItem name="PLD · Gonzalo Castillo" pct={pldPct} color={C.pld} />
                {bloques?.filter((b: any) => !['PRM','FP','PLD'].includes(b.bloque)).map((b: any) => (
                  <BarItem key={b.bloque} name={b.bloque} pct={Number(b.pct)} color={C.muted2} />
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={hdr}>
                <span style={cardTitle}>Senadores 2024</span>
                <span style={cardBadge}>32 provincias</span>
              </div>
              <div style={{ padding: '.75rem' }}>
                {[
                  { label: 'PRM', val: '23 / 32', color: C.prm, pct: 71.9 },
                  { label: 'FP', val: '6 / 32', color: C.fp, pct: 18.75 },
                  { label: 'PLD', val: '2 / 32', color: C.pld, pct: 6.25 },
                  { label: 'Otros', val: '1 / 32', color: C.muted2, pct: 3.1 },
                ].map(s => (
                  <div key={s.label} style={{ marginBottom: '.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.15rem' }}>
                      <span style={{ fontSize: '.73rem', color: s.color, fontWeight: 500 }}>{s.label}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '.7rem', color: s.color }}>{s.val}</span>
                    </div>
                    <div style={{ height: '4px', background: C.bg4, borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: '99px' }}></div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '.75rem', paddingTop: '.5rem', borderTop: `1px solid ${C.border}` }}>
                  <Link href="/senadores" style={{ fontSize: '.67rem', color: C.muted2, textDecoration: 'none' }}>
                    Ver tabla completa 32 provincias →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Progreso meta */}
          <div style={card}>
            <div style={hdr}>
              <span style={cardTitle}>Brecha para 2028</span>
              <span style={cardBadge}>Base JCE 2024</span>
            </div>
            <div style={{ padding: '.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.25rem', fontSize: '.72rem' }}>
                    <span>FP 2024: <strong style={{ color: C.fp }}>{fmt(fpVotos)}</strong></span>
                    <span style={{ color: C.muted2 }}>Meta ~2.4M</span>
                  </div>
                  <div style={{ height: '7px', background: C.bg4, borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(fpVotos / 2400000 * 100, 100)}%`, background: `linear-gradient(90deg, #7a1428, var(--fp))`, borderRadius: '99px' }}></div>
                  </div>
                  <div style={{ fontSize: '.65rem', color: C.muted, marginTop: '.25rem' }}>
                    {(fpVotos / 2400000 * 100).toFixed(1)}% completado
                  </div>
                </div>
                <div>
                  {[
                    { label: '① Alianza FP+PLD', val: '~357K', color: C.green },
                    { label: '② Nuevos electores', val: '~222K', color: C.prm },
                    { label: '③ Movilización abstencionistas', val: '~117K', color: C.amber },
                    { label: '④ Transferencia PLD', val: '~37K', color: C.pld },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '.2rem 0', borderBottom: `1px solid #ffffff06`, fontSize: '.72rem' }}>
                      <span style={{ color: C.muted2 }}>{f.label}</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: f.color }}>{f.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          <div style={card}>
            <div style={hdr}>
              <span style={cardTitle}>Encuestas recientes</span>
              <span style={cardBadge}>Intención</span>
            </div>
            {encuestas?.map((enc: any) => (
              <div key={enc.id} style={{ padding: '.6rem .75rem', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.25rem' }}>
                  <span style={{ fontSize: '.78rem', fontWeight: 600 }}>{enc.firma}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '.58rem', background: '#10b98118', color: '#10b981', border: '1px solid #10b98128', padding: '.06rem .3rem', borderRadius: '3px' }}>
                    {enc.tipo?.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '.65rem', color: C.muted, marginBottom: '.3rem' }}>
                  {enc.fecha} · N={enc.n_muestra || '?'}
                </div>
                <div style={{ display: 'flex', gap: '4px', height: '3px', borderRadius: '2px', overflow: 'hidden', marginBottom: '.25rem' }}>
                  <div style={{ flex: enc.prm || 0, background: C.prm }}></div>
                  <div style={{ flex: enc.fp || 0, background: C.fp }}></div>
                  <div style={{ flex: enc.pld || 0, background: C.pld }}></div>
                </div>
                <div style={{ display: 'flex', gap: '.5rem', fontFamily: 'monospace', fontSize: '.6rem' }}>
                  <span style={{ color: C.prm }}>PRM {enc.prm}%</span>
                  <span style={{ color: C.fp }}>FP {enc.fp}%</span>
                  <span style={{ color: C.pld }}>PLD {enc.pld}%</span>
                </div>
              </div>
            ))}
            <div style={{ padding: '.4rem .75rem' }}>
              <span style={{ fontSize: '.67rem', color: C.muted2 }}>Próximamente: Vista Encuestas completa</span>
            </div>
          </div>

          <div style={{ ...card, padding: '.75rem' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '.56rem', textTransform: 'uppercase', letterSpacing: '.1em', color: C.muted, marginBottom: '.5rem' }}>Navegación rápida</div>
            {[
              { href: '/presidencial', label: '▣ Presidencial 2024', sub: 'KPIs · bloques · 32 provincias' },
              { href: '/senadores', label: '▢ Senadores 2024', sub: '32 provincias · ganadores' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                display: 'block', padding: '.4rem .5rem', borderRadius: '5px',
                background: C.bg3, border: `1px solid ${C.border2}`,
                marginBottom: '.35rem', textDecoration: 'none',
                transition: 'border-color .15s'
              }}>
                <div style={{ fontSize: '.73rem', color: C.text, fontWeight: 500 }}>{l.label}</div>
                <div style={{ fontSize: '.62rem', color: C.muted2, marginTop: '.1rem' }}>{l.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
