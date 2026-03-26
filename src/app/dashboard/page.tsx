import{supabase}from'@/lib/supabase';
import{C,bc,fmt}from'@/lib/utils';
import{KpiCard,Bar,Badge}from'@/components/ui';
import Link from'next/link';
export const revalidate=3600;
export default async function Page(){
  const[{data:bl},{data:enc}]=await Promise.all([
    supabase.from('sie_bloques_nacional').select('*').eq('eleccion_id',3).eq('tipo_cargo','presidente').order('votos',{ascending:false}),
    supabase.from('sie_encuestas').select('*').order('fecha',{ascending:false}).limit(3),
  ]);
  const bm:Record<string,{v:number,p:number}>={};let tv=0;
  bl?.forEach((b:any)=>{bm[b.bloque]={v:Number(b.votos),p:Number(b.pct)};tv=Number(b.votos_validos);});
  const fp=bm.FP?.v??0,prm=bm.PRM?.v??0,fpP=bm.FP?.p??0,prmP=bm.PRM?.p??0,pldP=bm.PLD?.p??0;
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Dashboard</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>ELECCIONES 2024</span>
        </div>
        <div style={{display:'flex',gap:'.4rem'}}>
          {[{h:'/analisis',l:'Centro Análisis →'},{h:'/alianzas',l:'Alianzas →'},{h:'/simulador',l:'Simulador →'}].map(x=>(
            <Link key={x.h} href={x.h} style={{padding:'0 .65rem',height:'26px',background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:'5px',color:C.muted2,fontSize:'.7rem',textDecoration:'none',display:'flex',alignItems:'center'}}>{x.l}</Link>
          ))}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="FP Bloque" value={`${fpP.toFixed(2)}%`} sub={`${fmt(fp)} votos`} color={C.fp}/>
        <KpiCard label="PRM Bloque" value={`${prmP.toFixed(2)}%`} sub={`${fmt(prm)} votos`} color={C.prm}/>
        <KpiCard label="PLD" value={`${pldP.toFixed(2)}%`} sub={`${fmt(bm.PLD?.v??0)} votos`} color={C.pld}/>
        <KpiCard label="Válidos" value={fmt(tv)} sub="Nacional" color={C.green}/>
        <KpiCard label="Margen PRM-FP" value={`${(prmP-fpP).toFixed(1)}pp`} sub="Brecha" color={C.red}/>
        <KpiCard label="Senadores FP" value="6/32" sub="PRM 23 · PLD 2" color={C.amber}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'3fr 1fr',gap:'.6rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.6rem'}}>
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
                <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Presidencial 2024</span>
                <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border}`,padding:'.06rem .35rem',borderRadius:'3px'}}>JCE</span>
              </div>
              <div style={{padding:'.75rem'}}>
                <Bar pct={prmP} color={C.prm} label="PRM · Luis Abinader" val={`${prmP.toFixed(2)}%`}/>
                <Bar pct={fpP} color={C.fp} label="FP · Leonel Fernández" val={`${fpP.toFixed(2)}%`}/>
                <Bar pct={pldP} color={C.pld} label="PLD · Gonzalo Castillo" val={`${pldP.toFixed(2)}%`}/>
              </div>
            </div>
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
              <div style={{padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1,fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Senado 2024</div>
              <div style={{padding:'.75rem'}}>
                {([{l:'PRM',v:23,c:C.prm},{l:'FP',v:6,c:C.fp},{l:'PLD',v:2,c:C.pld},{l:'Otros',v:1,c:C.muted2}] as any[]).map((b:any)=>(
                  <div key={b.l} style={{marginBottom:'.5rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.15rem'}}><span style={{fontSize:'.73rem',color:b.c,fontWeight:500}}>{b.l}</span><span style={{fontFamily:'monospace',fontSize:'.7rem',color:b.c}}>{b.v}/32</span></div>
                    <div style={{height:'4px',background:C.bg4,borderRadius:'99px',overflow:'hidden'}}><div style={{height:'100%',width:`${b.v/32*100}%`,background:b.c,borderRadius:'99px'}}/></div>
                  </div>
                ))}
                <Link href="/senadores" style={{fontSize:'.67rem',color:C.muted2,textDecoration:'none'}}>Ver 32 provincias →</Link>
              </div>
            </div>
          </div>
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
            <div style={{padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1,fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Brecha hacia 2028 — Fuentes de votos</div>
            <div style={{padding:'.75rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.25rem',fontSize:'.72rem'}}><span>FP 2024: <strong style={{color:C.fp}}>{fmt(fp)}</strong></span><span style={{color:C.muted2}}>Meta ~2.4M</span></div>
                <div style={{height:'7px',background:C.bg4,borderRadius:'99px',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(fp/2400000*100,100)}%`,background:`linear-gradient(90deg,#7a1428,${C.fp})`,borderRadius:'99px'}}/></div>
                <div style={{fontSize:'.65rem',color:C.muted,marginTop:'.25rem'}}>{(fp/2400000*100).toFixed(1)}% · Gap: {fmt(2400000-fp)}</div>
              </div>
              <div>
                {[{l:'① Alianza FP+PLD',v:'~357K',c:C.green},{l:'② Nuevos electores',v:'~222K',c:C.prm},{l:'③ Movilización abs.',v:'~117K',c:C.amber},{l:'④ Transferencia PLD',v:'~37K',c:C.pld}].map(f=>(
                  <div key={f.l} style={{display:'flex',justifyContent:'space-between',padding:'.2rem 0',borderBottom:'1px solid #ffffff06',fontSize:'.72rem'}}>
                    <span style={{color:C.muted2}}>{f.l}</span><span style={{fontFamily:'monospace',fontWeight:600,color:f.c}}>{f.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.4rem'}}>
            {[{h:'/presidencial',i:'▣',l:'Presidencial',s:'32 prov.'},{h:'/senadores',i:'▢',l:'Senadores',s:'32 ganadores'},{h:'/diputados',i:'▦',l:'Diputados',s:'Territoriales'},{h:'/alcaldes',i:'◧',l:'Alcaldes',s:'158 mun.'},{h:'/analisis',i:'◈',l:'Análisis',s:'Transferencia'},{h:'/alianzas',i:'◐',l:'Alianzas',s:'FP+PLD'}].map(x=>(
              <Link key={x.h} href={x.h} style={{display:'block',padding:'.5rem',borderRadius:'8px',background:C.bg3,border:`1px solid ${C.border2}`,textDecoration:'none'}}>
                <div style={{fontSize:'.85rem',marginBottom:'.2rem'}}>{x.i}</div>
                <div style={{fontSize:'.72rem',color:C.text,fontWeight:500}}>{x.l}</div>
                <div style={{fontSize:'.6rem',color:C.muted2}}>{x.s}</div>
              </Link>
            ))}
          </div>
        </div>
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
            <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Encuestas</span>
            <Link href="/encuestas" style={{fontFamily:'monospace',fontSize:'.55rem',color:C.fp,textDecoration:'none'}}>Ver →</Link>
          </div>
          {enc?.map((e:any)=>{
            const fp_=Number(e.fp_pct)||0,prm_=Number(e.prm_pct)||0,pld_=Number(e.pld_pct)||0,t=fp_+prm_+pld_||1;
            const qc=e.calidad?.trim()==='A'?'#10b981':'#f59e0b';
            return(
              <div key={e.id} style={{padding:'.6rem .75rem',borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.2rem'}}>
                  <span style={{fontSize:'.78rem',fontWeight:600}}>{e.firma}</span>
                  <span style={{fontFamily:'monospace',fontSize:'.55rem',padding:'.05rem .28rem',borderRadius:'3px',background:qc+'18',color:qc,border:`1px solid ${qc}30`}}>{e.calidad?.trim()}</span>
                </div>
                <div style={{fontSize:'.63rem',color:C.muted,marginBottom:'.3rem'}}>{e.fecha} · {e.tipo==='intencion_candidato'?'Intención':'Simpatía'}</div>
                <div style={{display:'flex',gap:'3px',height:'3px',marginBottom:'.28rem'}}>
                  <div style={{flex:prm_/t,background:C.prm,borderRadius:'2px'}}/><div style={{flex:fp_/t,background:C.fp,borderRadius:'2px'}}/><div style={{flex:pld_/t,background:C.pld,borderRadius:'2px'}}/>
                </div>
                <div style={{display:'flex',gap:'.5rem',fontFamily:'monospace',fontSize:'.6rem'}}>
                  <span style={{color:C.prm}}>PRM {prm_.toFixed(1)}%</span>
                  <span style={{color:C.fp}}>FP {fp_.toFixed(1)}%</span>
                  <span style={{color:C.pld}}>PLD {pld_.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
