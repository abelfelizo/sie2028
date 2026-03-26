'use client';
import Link from'next/link';
import{usePathname}from'next/navigation';
const nav=[
  {s:'Campaña FP',items:[
    {h:'/dashboard',l:'Dashboard',i:'◈'},
    {h:'/proyeccion',l:'Proyección 2028',i:'◎'},
    {h:'/objetivo',l:'Objetivo 2028',i:'◉'},
  ]},
  {s:'Base Electoral',items:[
    {h:'/presidencial',l:'Presidencial',i:'▣'},
    {h:'/senadores',l:'Senadores',i:'▢',b:'32'},
    {h:'/diputados',l:'Diputados',i:'▦',b:'32p'},
    {h:'/alcaldes',l:'Alcaldes',i:'◧',b:'158'},
    {h:'/historico',l:'Histórico 2020',i:'◌'},
    {h:'/encuestas',l:'Encuestas',i:'◑',b:'6'},
  ]},
  {s:'Inteligencia FP',items:[
    {h:'/analisis',l:'Centro de Análisis',i:'◈'},
    {h:'/alianzas',l:'Alianzas FP+PLD',i:'◐'},
    {h:'/riesgo',l:'Mapa de Riesgo',i:'◕'},
    {h:'/simulador',l:'Simulador',i:'⊕'},
  ]},
  {s:'Próximamente',items:[
    {h:'#',l:'Exterior',i:'◯',d:true},
    {h:'#',l:'Exportar PDF',i:'◧',d:true},
  ]},
];
export default function Sidebar(){
  const p=usePathname();
  return(
    <nav style={{width:'192px',background:'#0e1018',borderRight:'1px solid #252a3a',display:'flex',flexDirection:'column',overflowY:'auto',flexShrink:0,scrollbarWidth:'none'}}>
      {nav.map(g=>(
        <div key={g.s}>
          <div style={{padding:'.9rem .75rem .25rem',fontFamily:'monospace',fontSize:'.56rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'#5a6185'}}>{g.s}</div>
          {g.items.map((item:any)=>{
            const active=!item.d&&(p===item.h||(item.h!=='/'&&item.h!=='#'&&p.startsWith(item.h)));
            return(
              <Link key={item.h+item.l} href={item.d?'#':item.h} style={{display:'flex',alignItems:'center',gap:'.45rem',padding:'.3rem .75rem',fontSize:'.76rem',color:item.d?'#5a6185':active?'#dde1f0':'#7a85b0',borderLeft:`2px solid ${active?'#e8294a':'transparent'}`,background:active?'#e8294a0a':'transparent',fontWeight:active?500:400,textDecoration:'none',opacity:item.d?0.4:1,cursor:item.d?'not-allowed':'pointer'}}>
                <span style={{fontSize:'.8rem',width:'16px',textAlign:'center',opacity:active?1:.7}}>{item.i}</span>
                <span style={{flex:1}}>{item.l}</span>
                {item.b&&!item.d&&<span style={{fontFamily:'monospace',fontSize:'.55rem',background:active?'#e8294a':'#242840',border:`1px solid ${active?'#e8294a':'#2f3550'}`,color:active?'#fff':'#7a85b0',padding:'.06rem .3rem',borderRadius:'3px'}}>{item.b}</span>}
                {item.d&&<span style={{fontFamily:'monospace',fontSize:'.48rem',color:'#5a6185',background:'#1c2030',border:'1px solid #252a3a',padding:'.04rem .25rem',borderRadius:'2px'}}>soon</span>}
              </Link>
            );
          })}
        </div>
      ))}
      <div style={{marginTop:'auto',padding:'.75rem',borderTop:'1px solid #252a3a'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.35rem',background:'#1c2030',border:'1px solid #2f3550',borderRadius:'5px',padding:'.35rem .55rem',fontSize:'.66rem',color:'#7a85b0'}}>
          <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#10b981',flexShrink:0}}/>DB 2024+2020 activa
        </div>
      </div>
    </nav>
  );
}
