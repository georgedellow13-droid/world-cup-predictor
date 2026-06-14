'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tziyafltitlehkbdxrre.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6aXlhZmx0aXRsZWhrYmR4cnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTkyMDEsImV4cCI6MjA5NjU5NTIwMX0.bJGgqz4uiEqBqaVGzmjmKexiz-J7igXLOQm0839-90E'
)

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']

const PRED_GROUPS: Record<string, string[]> = {
  A: ['Mexico','South Africa','Korea Republic','Czechia'],
  B: ['Canada','Bosnia-Herzegovina','Qatar','Switzerland'],
  C: ['Brazil','Morocco','Haiti','Scotland'],
  D: ['United States','Paraguay','Australia','Turkey'],
  E: ['Germany','Curacao','Ivory Coast','Ecuador'],
  F: ['Netherlands','Japan','Sweden','Tunisia'],
  G: ['Belgium','Egypt','Iran','New Zealand'],
  H: ['Spain','Cape Verde Islands','Saudi Arabia','Uruguay'],
  I: ['France','Senegal','Iraq','Norway'],
  J: ['Argentina','Algeria','Austria','Jordan'],
  K: ['Portugal','Congo DR','Uzbekistan','Colombia'],
  L: ['England','Croatia','Ghana','Panama'],
}

function buildTable(matches: any[], group: string) {
  const table: Record<string, {team:string,p:number,w:number,d:number,l:number,gf:number,ga:number,pts:number}> = {}

  const groupMatches = matches.filter(m => m.group === `GROUP_${group}` && (m.status === 'FINISHED' || m.status === 'IN_PLAY' || m.status === 'PAUSED'))

  groupMatches.forEach(m => {
    const home = m.homeTeam?.name
    const away = m.awayTeam?.name
    const hg = m.score?.fullTime?.home ?? 0
    const ag = m.score?.fullTime?.away ?? 0

    if (!table[home]) table[home] = {team:home,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}
    if (!table[away]) table[away] = {team:away,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}

    table[home].p++; table[away].p++
    table[home].gf += hg; table[home].ga += ag
    table[away].gf += ag; table[away].ga += hg

    if (hg > ag) {
      table[home].w++; table[home].pts += 3
      table[away].l++
    } else if (hg === ag) {
      table[home].d++; table[home].pts++
      table[away].d++; table[away].pts++
    } else {
      table[away].w++; table[away].pts += 3
      table[home].l++
    }
  })

  return Object.values(table).sort((a,b) => b.pts - a.pts || (b.gf-b.ga) - (a.gf-a.ga) || b.gf - a.gf)
}

function LiveScores() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState('A')

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then(data => {
        setMatches(data.matches || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const groupMatches = matches.filter(m => m.group === `GROUP_${activeGroup}`)
  const table = buildTable(matches, activeGroup)

  return (
    <div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px'}}>
        {GROUPS.map(g => (
          <button key={g} onClick={() => setActiveGroup(g)} style={{
            width:'36px',height:'36px',borderRadius:'50%',border:'none',
            background: activeGroup===g ? '#e63946' : '#333',
            color:'white',cursor:'pointer',fontWeight:'bold'
          }}>{g}</button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {table.length > 0 && (
        <div style={{marginBottom:'16px',overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.8rem'}}>
            <thead>
              <tr style={{color:'#aaa',borderBottom:'1px solid #333'}}>
                <th style={{textAlign:'left',padding:'6px 4px'}}>Team</th>
                <th style={{padding:'6px 4px'}}>P</th>
                <th style={{padding:'6px 4px'}}>W</th>
                <th style={{padding:'6px 4px'}}>D</th>
                <th style={{padding:'6px 4px'}}>L</th>
                <th style={{padding:'6px 4px'}}>GD</th>
                <th style={{padding:'6px 4px'}}>Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={row.team} style={{
                  borderBottom:'1px solid #222',
                  background: i < 2 ? 'rgba(46,204,113,0.15)' : i < 4 ? 'rgba(52,152,219,0.15)' : 'transparent'
                }}>
                  <td style={{padding:'6px 4px'}}>{i+1}. {row.team}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.p}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.w}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.d}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.l}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.gf-row.ga > 0 ? '+' : ''}{row.gf-row.ga}</td>
                  <td style={{textAlign:'center',padding:'6px 4px',fontWeight:'bold'}}>{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:'flex',gap:'16px',marginTop:'8px',fontSize:'0.75rem',color:'#aaa'}}>
            <span><span style={{color:'#2ecc71'}}>■</span> Qualify (top 2)</span>
            <span><span style={{color:'#3498db'}}>■</span> Possible (3rd/4th)</span>
          </div>
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {groupMatches.length === 0 && !loading && <p style={{color:'#aaa'}}>No matches yet for Group {activeGroup}</p>}
        {groupMatches.map((m, i) => (
          <div key={i} style={{background:'#16213e',borderRadius:'10px',padding:'12px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:'0.85rem',flex:1,textAlign:'right'}}>{m.homeTeam?.name}</span>
              <div style={{margin:'0 10px',fontWeight:'bold',fontSize:'1.1rem',minWidth:'60px',textAlign:'center'}}>
                {m.status === 'FINISHED' || m.status === 'IN_PLAY' || m.status === 'PAUSED'
                  ? `${m.score?.fullTime?.home ?? 0} - ${m.score?.fullTime?.away ?? 0}`
                  : m.utcDate ? new Date(m.utcDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : '-'}
              </div>
              <span style={{fontSize:'0.85rem',flex:1}}>{m.awayTeam?.name}</span>
            </div>
            <div style={{textAlign:'center',fontSize:'0.75rem',color:'#aaa',marginTop:'4px'}}>
              {m.status === 'FINISHED' ? '✅ FT' : m.status === 'IN_PLAY' ? '🔴 LIVE' : m.status === 'PAUSED' ? '⏸ HT' : '🕐 Upcoming'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [username, setUsername] = useState('')
  const [activeTab, setActiveTab] = useState('predictions')
  const [activeGroup, setActiveGroup] = useState('A')
  const [predictions, setPredictions] = useState<Record<string,{home:string,away:string}>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('wc_username')
    if (!u) { window.location.href = '/login'; return }
    setUsername(u)
    loadPredictions(u)
  }, [])

  async function loadPredictions(u: string) {
    const { data } = await supabase.from('predictions').select('*').eq('username', u)
    if (data) {
      const p: Record<string,{home:string,away:string}> = {}
      data.forEach((r: any) => { p[r.match_key] = { home: r.home_score, away: r.away_score } })
      setPredictions(p)
    }
  }

  async function savePredictions() {
    const rows = Object.entries(predictions).map(([match_key, scores]) => ({
      username, match_key, home_score: scores.home, away_score: scores.away
    }))
    await supabase.from('predictions').upsert(rows, { onConflict: 'username,match_key' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function setScore(key: string, side: 'home'|'away', val: string) {
    setPredictions(p => ({ ...p, [key]: { ...p[key], home: p[key]?.home||'0', away: p[key]?.away||'0', [side]: val } }))
  }

  const teams = PRED_GROUPS[activeGroup] || []
  const fixtures: {home:string,away:string}[] = []
  for (let i=0;i<teams.length;i++) for (let j=i+1;j<teams.length;j++) fixtures.push({home:teams[i],away:teams[j]})

  return (
    <main style={{minHeight:'100vh',background:'#1a1a2e',color:'white',padding:'16px',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:'1.4rem',marginBottom:'4px'}}>⚽ World Cup Tracker</h1>
      <p style={{color:'#aaa',marginBottom:'16px',fontSize:'0.9rem'}}>Welcome, {username}!</p>

      <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
        {['predictions','scores','bracket','squad'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding:'8px 14px',borderRadius:'8px',border:'none',
            background: activeTab===tab ? '#e63946' : '#333',
            color:'white',cursor:'pointer',textTransform:'capitalize',fontSize:'0.9rem'
          }}>{tab}</button>
        ))}
      </div>

      {activeTab==='predictions' && (
        <div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px'}}>
            {GROUPS.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)} style={{
                width:'36px',height:'36px',borderRadius:'50%',border:'none',
                background: activeGroup===g ? '#e63946' : '#333',
                color:'white',cursor:'pointer',fontWeight:'bold'
              }}>{g}</button>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {fixtures.map(({home,away}) => {
              const key = `${activeGroup}_${home}_${away}`
              const p = predictions[key]
              return (
                <div key={key} style={{background:'#16213e',borderRadius:'10px',padding:'12px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'0.85rem',flex:1,textAlign:'right'}}>{home}</span>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',margin:'0 10px'}}>
                    <input type="number" min="0" max="20" value={p?.home||''} onChange={e=>setScore(key,'home',e.target.value)}
                      style={{width:'40px',textAlign:'center',padding:'4px',borderRadius:'6px',border:'none',fontSize:'1rem'}} placeholder="0"/>
                    <span>-</span>
                    <input type="number" min="0" max="20" value={p?.away||''} onChange={e=>setScore(key,'away',e.target.value)}
                      style={{width:'40px',textAlign:'center',padding:'4px',borderRadius:'6px',border:'none',fontSize:'1rem'}} placeholder="0"/>
                  </div>
                  <span style={{fontSize:'0.85rem',flex:1}}>{away}</span>
                </div>
              )
            })}
          </div>
          <button onClick={savePredictions} style={{
            marginTop:'16px',width:'100%',padding:'12px',borderRadius:'10px',
            border:'none',background:'#2ecc71',color:'white',fontSize:'1rem',cursor:'pointer'
          }}>{saved ? '✅ Saved!' : 'Save Predictions'}</button>
        </div>
      )}

      {activeTab==='scores' && <LiveScores />}

      {activeTab==='bracket' && (
        <div style={{background:'#16213e',borderRadius:'12px',padding:'20px'}}>
          <p>Bracket coming soon!</p>
        </div>
      )}
      {activeTab==='squad' && (
        <div style={{background:'#16213e',borderRadius:'12px',padding:'20px'}}>
          <p>Squad picker coming soon!</p>
        </div>
      )}
    </main>
  )
}