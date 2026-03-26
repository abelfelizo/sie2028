'use client';
import{useState,useMemo}from'react';
import{C,fmt}from'@/lib/utils';
import{KpiCard,Badge}from'@/components/ui';

const PROVINCIAS=[
  {id:'01',n:'Distrito Nacional',fp:29.18,prm:51.48,pld:17.64,v:457360},
  {id:'32',n:'Santo Domingo',fp:27.15,prm:52.63,pld:10.66,v:799260},
  {id:'25',n:'Santiago',fp:21.77,prm:54.51,pld:18.76,v:507499},
  {id:'21',n:'San Cristóbal',fp:25.82,prm:50.39,pld:16.84,v:410036},
  {id:'13',n:'La Vega',fp:22.31,prm:53.93,pld:17.25,v:209647},
  {id:'18',n:'Puerto Plata',fp:20.01,prm:54.51,pld:19.87,v:191680},
  {id:'15',n:'Monte Plata',fp:24.92,prm:51.01,pld:18.74,v:109380},
  {id:'22',n:'San Pedro Macorís',fp:26.41,prm:50.84,pld:16.09,v:185720},
  {id:'06',n:'Dajabón',fp:7.65,prm:56.33,pld:32.43,v:36635},
  {id:'07',n:'Duarte',fp:14.10,prm:76.22,pld:11.99,v:118534},
  {id:'03',n:'Azua',fp:14.97,prm:66.25,pld:16.32,v:111704},
  {id:'05',n:'Barahona',fp:19.51,prm:60.57,pld:17.68,v:87163},
  {id:'09',n:'El Seibo',fp:20.16,prm:81.20,pld:24.96,v:30346},
  {id:'10',n:'Espaillat',fp:16.59,prm:74.33,pld:14.60,v:99216},
  {id:'12',n:'Independencia',fp:18.61,prm:56.51,pld:19.43,v:30982},
  {id:'11',n:'La Romana',fp:23.14,prm:56.18,pld:13.15,v:97264},
  {id:'30',n:'Hato Mayor',fp:18.57,prm:104.33,pld:36.89,v:40010},
  {id:'04',n:'Bahoruco',fp:13.16,prm:67.57,pld:17.85,v:50756},
  {id:'08',n:'Elías Piña',fp:15.28,prm:71.17,pld:13.46,v:38014},
  {id:'14',n:'María Trinidad',fp:22.05,prm:61.45,pld:12.84,v:57040},
  {id:'23',n:'Santiago Rodríguez',fp:10.95,prm:65.04,pld:19.98,v:25290},
  {id:'26',n:'Sánchez Ramírez',fp:12.86,prm:72.88,pld:13.46,v:59080},
  {id:'19',n:'Hermanas Mirabal',fp:18.62,prm:67.35,pld:14.32,v:52840},
  {id:'16',n:'Pedernales',fp:26.95,prm:57.26,pld:9.63,v:13012},
  {id:'17',n:'Peravia',fp:23.41,prm:60.20,pld:15.01,v:88540},
  {id:'20',n:'San José Ocoa',fp:22.30,prm:63.64,pld:9.68,v:28380},
  {id:'24',n:'San Juan',fp:22.94,prm:59.98,pld:14.07,v:147640},
  {id:'27',n:'Samaná',fp:19.82,prm:62.37,pld:15.69,v:43680},
  {id:'28',n:'Valverde',fp:17.93,prm:65.72,pld:12.67,v:69390},
  {id:'29',n:'Monseñor Nouel',fp:20.02,prm:64.86,pld:12.63,v:67830},
  {id:'31',n:'Santo Domingo Oeste',fp:27.50,prm:52.00,pld:14.50,v:180000},
  {id:'02',n:'Azua Ext.',fp:22.00,prm:58.00,pld:14.00,v:45000},
];

export default function Simulador(){
  const[fpSwing,setFpSwing]=useState(0);
  const[pldTrans,setPldTrans]=useState(50);
  const[absMovil,setAbsMovil]=useState(15);

  const resultados=useMemo(()=>{
    return PROVINCIAS.map(p=>{
      const fpBase=p.fp_pct/100*p.v;
      const prmBase=p.prm_pct/100*p.v;
      const pldBase=p.pld_pct/100*p.v;
      const transf=pldBase*(pldTrans/100);
      const absExtra=p.v*(1-(p.fp_pct+p.prm_pct+p.pld_pct)/100)*(absMovil/100);
      const fpFinal=fpBase+transf+absExtra*(fpSwing/100+0.4);
      const prmFinal=prmBase+absExtra*(1-(fpSwing/100+0.4));
      const ganador=fpFinal>prmFinal?'FP':'PRM';
      const fpPct=fpFinal/p.v*100;
      const prmPct=prmFinal/p.v*100;
      return{...p,fpFinal,prmFinal,fpPct,prmPct,ganador,margen:(fpPct-prmPct)};
    });
  },[fpSwing,pldTrans,absMovil]);

  const fpGana=resultados.filter(r=>r.ganador==='FP').length;
  const fpVotosTotal=resultados.reduce((a,r)=>a+r.fpFinal,0);
  const prmVotosTotal=resultados.reduce((a,r)=>a+r.prmFinal,0);
  const totVal=resultados.reduce((a,r)=>a+r.v,0);
  const fpPctNac=fpVotosTotal/totVal*100;
  const prmPctNac=prmVotosTotal/totVal*100;
  const gana=fpPctNac>prmPctNac;

  const sliderStyle={width:'100%',accentColor:C.fp,cursor:'pointer'};

  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.45rem'}}>
          <span style={{fontSize:'1rem',fontWeight:600}}>Simulador Electoral 2028</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:C.muted,background:C.bg3,border:`1px solid ${C.border2}`,padding:'.1rem .35rem',borderRadius:'3px'}}>INTERACTIVO</span>
        </div>
      </div>

      {/* Sliders */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',padding:'.75rem',marginBottom:'.85rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}}>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.4rem',fontSize:'.72rem'}}>
              <span style={{fontWeight:500}}>Swing positivo FP</span>
              <span style={{fontFamily:'monospace',color:C.fp,fontWeight:600}}>+{fpSwing}pp</span>
            </div>
            <input type="range" min={-10} max={15} value={fpSwing} onChange={e=>setFpSwing(Number(e.target.value))} style={sliderStyle}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'.6rem',color:C.muted,marginTop:'.2rem'}}><span>-10pp</span><span>Base 0</span><span>+15pp</span></div>
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.4rem',fontSize:'.72rem'}}>
              <span style={{fontWeight:500}}>Transferencia PLD → FP</span>
              <span style={{fontFamily:'monospace',color:C.pld,fontWeight:600}}>{pldTrans}%</span>
            </div>
            <input type="range" min={0} max={100} value={pldTrans} onChange={e=>setPldTrans(Number(e.target.value))} style={{...sliderStyle,accentColor:C.pld}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'.6rem',color:C.muted,marginTop:'.2rem'}}><span>0%</span><span>50%</span><span>100%</span></div>
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.4rem',fontSize:'.72rem'}}>
              <span style={{fontWeight:500}}>Movilización abstención</span>
              <span style={{fontFamily:'monospace',color:C.amber,fontWeight:600}}>{absMovil}%</span>
            </div>
            <input type="range" min={0} max={40} value={absMovil} onChange={e=>setAbsMovil(Number(e.target.value))} style={{...sliderStyle,accentColor:C.amber}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'.6rem',color:C.muted,marginTop:'.2rem'}}><span>0%</span><span>20%</span><span>40%</span></div>
          </div>
        </div>
      </div>

      {/* KPIs resultado */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
        <KpiCard label="Resultado FP" value={`${fpPctNac.toFixed(2)}%`} sub={fmt(Math.round(fpVotosTotal))+' votos'} color={C.fp}/>
        <KpiCard label="Resultado PRM" value={`${prmPctNac.toFixed(2)}%`} sub={fmt(Math.round(prmVotosTotal))+' votos'} color={C.prm}/>
        <KpiCard label="Margen" value={`${Math.abs(fpPctNac-prmPctNac).toFixed(1)}pp`} sub={gana?'FP gana':'PRM gana'} color={gana?C.green:C.red}/>
        <KpiCard label="Provincias FP" value={`${fpGana}/32`} sub={`PRM: ${32-fpGana}/32`} color={gana?C.green:C.amber}/>
        <div style={{background:C.bg2,border:`2px solid ${gana?C.green:C.red}`,borderRadius:'6px',padding:'.65rem .75rem',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'.3rem'}}>
          <div style={{fontFamily:'monospace',fontSize:'.56rem',textTransform:'uppercase',letterSpacing:'.1em',color:C.muted}}>Ganador proyectado</div>
          <div style={{fontFamily:'monospace',fontSize:'1.4rem',fontWeight:700,color:gana?C.green:C.red}}>{gana?'FP':'PRM'}</div>
        </div>
      </div>

      {/* Tabla provincias */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:'10px',overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.55rem .8rem',borderBottom:`1px solid ${C.border}`,background:C.bg1}}>
          <span style={{fontFamily:'monospace',fontSize:'.63rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Resultado proyectado por provincia</span>
          <span style={{fontFamily:'monospace',fontSize:'.58rem',color:gana?C.green:C.red,fontWeight:700,background:gana?'#10b98118':'#ef444418',border:`1px solid ${gana?C.green:C.red}30`,padding:'.06rem .45rem',borderRadius:'3px'}}>{gana?`FP +${(fpPctNac-prmPctNac).toFixed(1)}pp`:`PRM +${(prmPctNac-fpPctNac).toFixed(1)}pp`}</span>
        </div>
        <div style={{maxHeight:'400px',overflowY:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.74rem'}}>
            <thead><tr>
              {['Provincia','FP base','FP proy.','PRM proy.','Margen','Ganador'].map((h,i)=>(
                <th key={h} style={{padding:'.35rem .65rem',textAlign:i>0?'right' as const:'left' as const,fontFamily:'monospace',fontSize:'.58rem',fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg1,whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {resultados.sort((a,b)=>b.margen-a.margen).map(r=>(
                <tr key={r.id}>
                  <td style={{padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.text,fontSize:'.74rem',fontWeight:500}}>{r.n}</td>
                  <td style={{padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.muted2,fontSize:'.74rem',textAlign:'right',fontFamily:'monospace'}}>{r.fp_pct.toFixed(1)}%</td>
                  <td style={{padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.fp,fontSize:'.74rem',textAlign:'right',fontFamily:'monospace',fontWeight:600}}>{r.fpPct.toFixed(1)}%</td>
                  <td style={{padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:C.prm,fontSize:'.74rem',textAlign:'right',fontFamily:'monospace'}}>{r.prmPct.toFixed(1)}%</td>
                  <td style={{padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',color:r.margen>=0?C.green:C.red,fontSize:'.74rem',textAlign:'right',fontFamily:'monospace',fontWeight:600}}>{r.margen>=0?'+':''}{r.margen.toFixed(1)}pp</td>
                  <td style={{padding:'.32rem .65rem',borderBottom:'1px solid #ffffff05',fontSize:'.74rem',textAlign:'right'}}><Badge bloque={r.ganador}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
