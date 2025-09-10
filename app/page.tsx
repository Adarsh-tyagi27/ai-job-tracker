import KanbanBoard from './components/KanbanBoard';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <header style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 17, 21, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'fixed',
        width: '100%',
        zIndex: 100
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
            Job<span style={{ color: 'var(--accent)' }}>Hunter</span> AI
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Track, Analyze, and Win your dream job.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Stats
          </button>
          <button style={{
            background: 'var(--accent)',
            border: 'none',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px var(--accent-glow)'
          }}>
            New Application
          </button>
        </div>
      </header>

      <div style={{ paddingTop: '80px' }}>
        <KanbanBoard />
      </div>
    </main>
  );
}
