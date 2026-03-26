export default function Proximamente({ params }: { params: { slug: string } }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '2.5rem', opacity: .3 }}>◌</div>
      <div style={{ fontFamily: 'monospace', fontSize: '.7rem', color: '#5a6185', textTransform: 'uppercase', letterSpacing: '.1em' }}>Próximamente</div>
      <div style={{ fontSize: '.85rem', color: '#7a85b0' }}>Esta vista se habilitará en la próxima fase</div>
    </div>
  );
}
