'use client'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: 'white',
      padding: '20px',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
        World Cup Predictor
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px', textAlign: 'center' }}>
        Predict the scores. Beat your mates.
      </p>
      <button onClick={() => window.location.href = '/login'} style={{
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '16px 40px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}>
        Sign In
      </button>
    </main>
  )
}