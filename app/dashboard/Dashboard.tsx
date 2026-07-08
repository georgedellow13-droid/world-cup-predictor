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
    if (hg > ag) { table[home].w++; table[home].pts += 3; table[away].l++ }
    else if (hg === ag) { table[home].d++; table[home].pts++; table[away].d++; table[away].pts++ }
    else { table[away].w++; table[away].pts += 3; table[home].l++ }
  })
  return Object.values(table).sort((a,b) => b.pts - a.pts || (b.gf-b.ga) - (a.gf-a.ga) || b.gf - a.gf)
}

function scorePoints(predHome: number, predAway: number, realHome: number, realAway: number) {
  if (predHome === realHome && predAway === realAway) return 3
  const predGD = predHome - predAway
  const realGD = realHome - realAway
  if (predGD === realGD) return 2
  const predResult = predHome > predAway ? 'H' : predHome < predAway ? 'A' : 'D'
  const realResult = realHome > realAway ? 'H' : realHome < realAway ? 'A' : 'D'
  if (predResult !== realResult) return -1
  return 0
}

function getGroupStandings(matches: any[]) {
  const standings: Record<string, string[]> = {}
  GROUPS.forEach(g => {
    const table = buildTable(matches, g)
    standings[g] = table.map(t => t.team)
  })
  return standings
}

function getBest3rd(matches: any[], standings: Record<string, string[]>) {
  const thirdPlace: {team:string, pts:number, gd:number, gf:number}[] = []
  GROUPS.forEach(g => {
    const table = buildTable(matches, g)
    if (table.length >= 3) {
      const t = table[2]
      thirdPlace.push({team:t.team, pts:t.pts, gd:t.gf-t.ga, gf:t.gf})
    }
  })
  return thirdPlace
    .sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
    .slice(0, 8)
    .map(t => t.team)
}

function Bracket({ matches }: { matches: any[] }) {
  const standings = getGroupStandings(matches)
  const best3rd = getBest3rd(matches, standings)

  function get(group: string, pos: number) {
    const s = standings[group] || []
    return s[pos] || `${pos===0?'1st':'2nd'} Group ${group} (TBD)`
  }

  function getBest3rdSlot(i: number) {
    return best3rd[i] || `Best 3rd #${i+1} (TBD)`
  }

  const matchups = [
    { label: 'Match 1', home: get('A',1), away: get('B',1) },
    { label: 'Match 2', home: get('E',0), away: getBest3rdSlot(0) },
    { label: 'Match 3', home: get('F',0), away: get('C',1) },
    { label: 'Match 4', home: get('C',0), away: get('F',1) },
    { label: 'Match 5', home: get('I',0), away: getBest3rdSlot(1) },
    { label: 'Match 6', home: get('E',1), away: get('I',1) },
    { label: 'Match 7', home: get('A',0), away: getBest3rdSlot(2) },
    { label: 'Match 8', home: get('L',0), away: getBest3rdSlot(3) },
    { label: 'Match 9', home: get('G',0), away: getBest3rdSlot(4) },
    { label: 'Match 10', home: get('D',0), away: getBest3rdSlot(5) },
    { label: 'Match 11', home: get('H',0), away: get('J',1) },
    { label: 'Match 12', home: get('K',1), away: get('L',1) },
    { label: 'Match 13', home: get('B',0), away: getBest3rdSlot(6) },
    { label: 'Match 14', home: get('K',0), away: getBest3rdSlot(7) },
    { label: 'Match 15', home: get('J',0), away: get('H',1) },
    { label: 'Match 16', home: get('D',1), away: get('?',0) },
  ]

  const [picks, setPicks] = useState<Record<string,string>>({})

  function pick(label: string, team: string) {
    setPicks(p => ({...p, [label]: p[label] === team ? '' : team}))
  }

  return (
    <div>
      <h2 style={{fontSize:'1.1rem',marginBottom:'4px'}}>🏆 Round of 32</h2>
      <p style={{color:'#aaa',fontSize:'0.8rem',marginBottom:'16px'}}>Tap a team to pick the winner</p>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {matchups.map(({label, home, away}) => {
          const picked = picks[label]
          const isTBD = home.includes('TBD') || away.includes('TBD')
          return (
            <div key={label} style={{background:'#16213e',borderRadius:'10px',padding:'12px'}}>
              <div style={{fontSize:'0.7rem',color:'#aaa',marginBottom:'6px'}}>{label}</div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <button
                  onClick={() => !isTBD && pick(label, home)}
                  style={{
                    flex:1, padding:'8px', borderRadius:'8px', border:'none',
                    background: picked === home ? '#e63946' : '#0f3460',
                    color:'white', cursor: isTBD ? 'default' : 'pointer',
                    fontSize:'0.8rem', fontWeight: picked === home ? 'bold' : 'normal',
                    textAlign:'center'
                  }}
                >{home}</button>
                <span style={{color:'#aaa',fontWeight:'bold'}}>vs</span>
                <button
                  onClick={() => !isTBD && pick(label, away)}
                  style={{
                    flex:1, padding:'8px', borderRadius:'8px', border:'none',
                    background: picked === away ? '#e63946' : '#0f3460',
                    color:'white', cursor: isTBD ? 'default' : 'pointer',
                    fontSize:'0.8rem', fontWeight: picked === away ? 'bold' : 'normal',
                    textAlign:'center'
                  }}
                >{away}</button>
              </div>
              {picked && <div style={{textAlign:'center',fontSize:'0.75rem',color:'#2ecc71',marginTop:'4px'}}>✅ {picked}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Favourites({ matches }: { matches: any[] }) {
  const finishedMatches = matches.filter(m => m.status === 'FINISHED')
  const teamStats: Record<string, {team:string, played:number, pts:number, gf:number, ga:number, form:string[]}> = {}

  finishedMatches.forEach(m => {
    const home = m.homeTeam?.name
    const away = m.awayTeam?.name
    const hg = m.score?.fullTime?.home ?? 0
    const ag = m.score?.fullTime?.away ?? 0
    if (!teamStats[home]) teamStats[home] = {team:home, played:0, pts:0, gf:0, ga:0, form:[]}
    if (!teamStats[away]) teamStats[away] = {team:away, played:0, pts:0, gf:0, ga:0, form:[]}
    teamStats[home].played++; teamStats[away].played++
    teamStats[home].gf += hg; teamStats[home].ga += ag
    teamStats[away].gf += ag; teamStats[away].ga += hg
    if (hg > ag) { teamStats[home].pts += 3; teamStats[home].form.push('W'); teamStats[away].form.push('L') }
    else if (hg === ag) { teamStats[home].pts++; teamStats[home].form.push('D'); teamStats[away].pts++; teamStats[away].form.push('D') }
    else { teamStats[away].pts += 3; teamStats[away].form.push('W'); teamStats[home].form.push('L') }
  })

  const ranked = Object.values(teamStats)
    .filter(t => t.played > 0)
    .map(t => {
      const ppg = t.pts / t.played
      const gd = t.gf - t.ga
      const formScore = t.form.slice(-3).reduce((acc, f) => acc + (f==='W'?3:f==='D'?1:0), 0)
      const score = ppg * 10 + gd + t.gf * 0.1 + formScore
      return {...t, score, gd}
    })
    .sort((a,b) => b.score - a.score)

  function formColor(r: string) {
    if (r === 'W') return '#2ecc71'
    if (r === 'D') return '#f39c12'
    return '#e63946'
  }

  const trophies = ['🏆','⭐','🌟','💫','✨','🔥','💪','👍']

  return (
    <div>
      <h2 style={{fontSize:'1.1rem',marginBottom:'4px'}}>🔥 Favourites to Win</h2>
      <p style={{color:'#aaa',fontSize:'0.8rem',marginBottom:'16px'}}>Based on form, points per game and goal difference</p>
      {ranked.length === 0 && <p style={{color:'#aaa'}}>No finished matches yet!</p>}
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {ranked.map((t, i) => (
          <div key={t.team} style={{background:'#16213e',borderRadius:'10px',padding:'12px 16px',border: i === 0 ? '1px solid gold' : '1px solid transparent'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <span style={{fontSize:'1.2rem'}}>{trophies[i] || `${i+1}.`}</span>
                <div>
                  <div style={{fontWeight:'bold',fontSize:'0.95rem'}}>{t.team}</div>
                  <div style={{fontSize:'0.75rem',color:'#aaa'}}>{t.played} games · {t.pts} pts · GD {t.gd > 0 ? '+' : ''}{t.gd}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:'4px'}}>
                {t.form.slice(-3).map((f, j) => (
                  <span key={j} style={{width:'22px',height:'22px',borderRadius:'50%',background:formColor(f),display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:'bold',color:'white'}}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Leaderboard({ currentUser }: { currentUser: string }) {
  const [leaderboard, setLeaderboard] = useState<{username:string, points:number, correct:number}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function calculate() {
      const matchRes = await fetch('/api/matches')
      const matchData = await matchRes.json()
      const finishedMatches = (matchData.matches || []).filter((m: any) => m.status === 'FINISHED')
      const { data: allPredictions } = await supabase.from('predictions').select('*')
      const { data: allUsers } = await supabase.from('users').select('username')
      if (!allUsers || !allPredictions) { setLoading(false); return }
      const scores = allUsers.map((u: any) => {
        const userPreds = allPredictions.filter((p: any) => p.username === u.username)
        let points = 0
        let correct = 0
        finishedMatches.forEach((m: any) => {
          const realHome = m.score?.fullTime?.home
          const realAway = m.score?.fullTime?.away
          if (realHome === null || realAway === null) return
          const pred = userPreds.find((p: any) => {
            const key = p.match_key
            return key.includes(m.homeTeam?.name) && key.includes(m.awayTeam?.name)
          })
          if (!pred) return
          const pts = scorePoints(parseInt(pred.home_score), parseInt(pred.away_score), realHome, realAway)
          points += pts
          if (pts === 3) correct++
        })
        return { username: u.username, points, correct }
      })
      scores.sort((a, b) => b.points - a.points || b.correct - a.correct)
      setLeaderboard(scores)
      setLoading(false)
    }
    calculate()
  }, [])

  const medals = ['🥇','🥈','🥉']

  return (
    <div>
      <h2 style={{fontSize:'1.1rem',marginBottom:'16px'}}>🏆 Leaderboard</h2>
      {loading && <p>Calculating scores...</p>}
      {!loading && leaderboard.length === 0 && <p style={{color:'#aaa'}}>No scores yet!</p>}
      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
        {leaderboard.map((row, i) => (
          <div key={row.username} style={{
            background: row.username === currentUser ? 'rgba(230,57,70,0.2)' : '#16213e',
            borderRadius:'10px', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
            border: row.username === currentUser ? '1px solid #e63946' : '1px solid transparent'
          }}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <span style={{fontSize:'1.2rem'}}>{medals[i] || `${i+1}.`}</span>
              <span style={{fontWeight: row.username === currentUser ? 'bold' : 'normal'}}>{row.username}</span>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:'bold',fontSize:'1.1rem'}}>{row.points} pts</div>
              <div style={{fontSize:'0.75rem',color:'#aaa'}}>{row.correct} exact</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:'16px',fontSize:'0.75rem',color:'#aaa',background:'#16213e',borderRadius:'8px',padding:'10px'}}>
        <p style={{margin:'2px 0'}}>🎯 Exact score = 3pts</p>
        <p style={{margin:'2px 0'}}>↔️ Correct goal difference = 2pts</p>
        <p style={{margin:'2px 0'}}>❌ Wrong result = -1pt</p>
      </div>
    </div>
  )
}

function LiveScores() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState('A')

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then(data => { setMatches(data.matches || []); setLoading(false) })
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
                <tr key={row.team} style={{borderBottom:'1px solid #222', background: i < 2 ? 'rgba(46,204,113,0.15)' : i < 4 ? 'rgba(52,152,219,0.15)' : 'transparent'}}>
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
  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    const u = localStorage.getItem('wc_username')
    if (!u) { window.location.href = '/login'; return }
    setUsername(u)
    loadPredictions(u)
    fetch('/api/matches').then(r => r.json()).then(data => setMatches(data.matches || []))
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

  function isLocked(home: string, away: string) {
    const match = matches.find(m => m.homeTeam?.name === home && m.awayTeam?.name === away)
    if (!match) return false
    return new Date(match.utcDate) <= new Date()
  }

  function getRealScore(home: string, away: string) {
    const match = matches.find(m => m.homeTeam?.name === home && m.awayTeam?.name === away)
    if (!match) return null
    if (match.status !== 'FINISHED' && match.status !== 'IN_PLAY' && match.status !== 'PAUSED') return null
    const rh = match.score?.fullTime?.home
    const ra = match.score?.fullTime?.away
    if (rh === null || ra === null) return null
    return { home: rh, away: ra, status: match.status }
  }

  const teams = PRED_GROUPS[activeGroup] || []
  const fixtures: {home:string,away:string}[] = []
  for (let i=0;i<teams.length;i++) for (let j=i+1;j<teams.length;j++) fixtures.push({home:teams[i],away:teams[j]})

  return (
    <main style={{minHeight:'100vh',background:'#1a1a2e',color:'white',padding:'16px',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:'1.4rem',marginBottom:'4px'}}>⚽ World Cup Tracker</h1>
      <p style={{color:'#aaa',marginBottom:'16px',fontSize:'0.9rem'}}>Welcome, {username}!</p>

      <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
        {['predictions','scores','leaderboard','favourites','bracket','squad'].map(tab => (
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
              const locked = isLocked(home, away)
              const real = getRealScore(home, away)
              let pointsBadge = null
              if (real && p?.home !== undefined && p?.away !== undefined) {
                const pts = scorePoints(parseInt(p.home), parseInt(p.away), real.home, real.away)
                const color = pts === 3 ? '#2ecc71' : pts === 2 ? '#f39c12' : pts === -1 ? '#e63946' : '#aaa'
                const label = pts === 3 ? '🎯 +3' : pts === 2 ? '↔️ +2' : pts === -1 ? '❌ -1' : '0'
                pointsBadge = <span style={{fontSize:'0.75rem',color,fontWeight:'bold',marginLeft:'6px'}}>{label}</span>
              }
              return (
                <div key={key} style={{background:'#16213e',borderRadius:'10px',padding:'12px',opacity: locked ? 0.85 : 1}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontSize:'0.8rem',flex:1,textAlign:'right'}}>{home}</span>
                    <div style={{display:'flex',alignItems:'center',gap:'6px',margin:'0 8px'}}>
                      {locked ? (
                        <span style={{fontWeight:'bold',fontSize:'1rem',color:'#aaa'}}>{p?.home ?? '-'} - {p?.away ?? '-'} 🔒</span>
                      ) : (
                        <>
                          <input type="number" min="0" max="20" value={p?.home||''} onChange={e=>setScore(key,'home',e.target.value)}
                            style={{width:'40px',textAlign:'center',padding:'4px',borderRadius:'6px',border:'none',fontSize:'1rem'}} placeholder="0"/>
                          <span>-</span>
                          <input type="number" min="0" max="20" value={p?.away||''} onChange={e=>setScore(key,'away',e.target.value)}
                            style={{width:'40px',textAlign:'center',padding:'4px',borderRadius:'6px',border:'none',fontSize:'1rem'}} placeholder="0"/>
                        </>
                      )}
                    </div>
                    <span style={{fontSize:'0.8rem',flex:1}}>{away}</span>
                  </div>
                  {real && (
                    <div style={{textAlign:'center',marginTop:'6px',fontSize:'0.8rem'}}>
                      <span style={{color:'#aaa'}}>Real: </span>
                      <span style={{fontWeight:'bold'}}>{real.home} - {real.away}</span>
                      <span style={{color:'#aaa',marginLeft:'4px'}}>{real.status === 'FINISHED' ? '✅ FT' : '🔴 LIVE'}</span>
                      {pointsBadge}
                    </div>
                  )}
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
      {activeTab==='leaderboard' && <Leaderboard currentUser={username} />}
      {activeTab==='favourites' && <Favourites matches={matches} />}
      {activeTab==='bracket' && <Bracket matches={matches} />}
      {activeTab==='squad' && (
        <div style={{background:'#16213e',borderRadius:'12px',padding:'20px'}}>
          <p>Squad picker coming soon!</p>
        </div>
      )}
    </main>
  )
}