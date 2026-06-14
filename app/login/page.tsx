'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tziyafltitlehkbdxrre.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6aXlhZmx0aXRsZWhrYmR4cnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTkyMDEsImV4cCI6MjA5NjU5NTIwMX0.bJGgqz4uiEqBqaVGzmjmKexiz-J7igXLOQm0839-90E'
)

export default function Login() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleStart() {
    if (!username.trim()) {
      setMessage('Please enter a username')
      return
    }
    setLoading(true)
    const { error } = await supabase
      .from('users')
      .upsert({ username: username.trim() }, { onConflict: 'username' })
    if (error) {
      setMessage('Something went wrong: ' + error.message)
    } else {
      localStorage.setItem('wc_username', username.trim())
      window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', color: 'white', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>⚽ World Cup Tracker</h1>
      <p style={{ marginBottom: '32px', color: '#aaa' }}>Enter your name to get started</p>
      <input
        type="text"
        placeholder="Your name..."
        value={username}
        onChange={e => setUsername(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleStart()}
        style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', fontSize: '1rem', marginBottom: '12px', width: '100%', maxWidth: '300px' }}
      />
      {message && <p style={{ color: '#ff6b6b', marginBottom: '12px' }}>{message}</p>}
      <button
        onClick={handleStart}
        disabled={loading}
        style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', background: '#e63946', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
      >
        {loading ? 'Loading...' : "Let's Go!"}
      </button>
    </main>
  )
}