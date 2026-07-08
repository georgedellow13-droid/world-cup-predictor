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

function getKnockoutMatchups(matches: any[], stage: string) {
  return matches.filter(m => m.group === `GROUP_${stage}`)
}

function Bracket({ matches }: { matches: any[] }) {
  const r32 = getKnockoutMatchups(matches, 'R32')
  const r16 = getKnockoutMatchups(matches, 'R16')
  const qf = getKnockoutMatchups(matches, 'QF')
  const sf = getKnockoutMatchups(matches, 'SF')
  const final = getKnockoutMatchups(matches, 'FINAL')

  function MatchCard({ m }: { m: any }) {
    const home = m.homeTeam?.name || 'TBD'
    const away = m.awayTeam?.name || 'TBD'
    const hasScore = m.score?.fullTime?.home !== null && m.score?.fullTime?.home !== undefined
    return (
      <div style={{background:'#16213e',borderRadius:'10px',padding:'12px',marginBottom:'8px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:'0.85rem',flex:1,textAlign:'right'}}>{home}</span>
          <div style={{margin:'0 10px',fontWeight:'bold',fontSize:'1rem',minWidth:'50px',textAlign:'center'}}>
            {hasScore ? `${m.score.fullTime.home} - ${m.score.fullTime.away}` : 'vs'}
          </div>
          <span style={{fontSize:'0.85rem',flex:1}}>{away}</span>
        </div>
        <div style={{textAlign:'center',fontSize:'0.75rem',color:'#aaa',marginTop:'4px'}}>
          {m.status === 'FINISHED' ? '✅ FT' : m.status === 'IN_PLAY' ? '🔴 LIVE' : m.status === 'PAUSED' ? '⏸ HT' : '🕐 Upcoming'}
        </div>
      </div>
    )
  }

  function Section({ title, ms }: { title: string, ms: any[] }) {
    if (ms.length === 0) return null
    return (
      <div style={{marginBottom:'20px'}}>
        <h3 style={{fontSize:'0.9rem',color:'#e63946',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{title}</h3>
        {ms.map((m, i) => <MatchCard key={i} m={m} />)}
      </div>
    )
  }

  return (
    <div>
      <h2 style={{fontSize:'1.1rem',marginBottom:'16px'}}>🏆 Knockout Stage</h2>
      <Section title="Round of 32" ms={r32} />
      <Section title="Round of 16" ms={r16} />
      <Section title="Quarter Finals" ms={qf} />
      <Section title="Semi Finals" ms={sf} />
      <Section title="Final" ms={final} />
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
                  <span key={j} style={{width:'22px',height:'22px',borderRadius:'50%',background:f==='W'?'#2ecc71':f==='D'?'#f39c12':'#e63946',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:'bold',color:'white'}}>{f}</span>
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
        let points = 0, correct = 0
        finishedMatches.forEach((m: any) => {
          const realHome = m.score?.fullTime?.home
          const realAway = m.score?.fullTime?.away
          if (realHome === null || realAway === null) return
          const pred = userPreds.find((p: any) => p.match_key.includes(m.homeTeam?.name) && p.match_key.includes(m.awayTeam?.name))
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
    fetch('/api/matches').then(r => r.json()).then(data => { setMatches(data.matches || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const groupMatches = matches.filter(m => m.group === `GROUP_${activeGroup}`)
  const table = buildTable(matches, activeGroup)

  return (
    <div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px'}}>
        {GROUPS.map(g => (
          <button key={g} onClick={() => setActiveGroup(g)} style={{width:'36px',height:'36px',borderRadius:'50%',border:'none',background:activeGroup===g?'#e63946':'#333',color:'white',cursor:'pointer',fontWeight:'bold'}}>{g}</button>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {table.length > 0 && (
        <div style={{marginBottom:'16px',overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.8rem'}}>
            <thead>
              <tr style={{color:'#aaa',borderBottom:'1px solid #333'}}>
                <th style={{textAlign:'left',padding:'6px 4px'}}>Team</th>
                <th style={{padding:'6px 4px'}}>P</th><th style={{padding:'6px 4px'}}>W</th><th style={{padding:'6px 4px'}}>D</th><th style={{padding:'6px 4px'}}>L</th><th style={{padding:'6px 4px'}}>GD</th><th style={{padding:'6px 4px'}}>Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={row.team} style={{borderBottom:'1px solid #222',background:i<2?'rgba(46,204,113,0.15)':i<4?'rgba(52,152,219,0.15)':'transparent'}}>
                  <td style={{padding:'6px 4px'}}>{i+1}. {row.team}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.p}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.w}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.d}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.l}</td>
                  <td style={{textAlign:'center',padding:'6px 4px'}}>{row.gf-row.ga>0?'+':''}{row.gf-row.ga}</td>
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
                {m.status==='FINISHED'||m.status==='IN_PLAY'||m.status==='PAUSED'?`${m.score?.fullTime?.home??0} - ${m.score?.fullTime?.away??0}`:m.utcDate?new Date(m.utcDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'-'}
              </div>
              <span style={{fontSize:'0.85rem',flex:1}}>{m.awayTeam?.name}</span>
            </div>
            <div style={{textAlign:'center',fontSize:'0.75rem',color:'#aaa',marginTop:'4px'}}>
              {m.status==='FINISHED'?'✅ FT':m.status==='IN_PLAY'?'🔴 LIVE':m.status==='PAUSED'?'⏸ HT':'🕐 Upcoming'}
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
    const rows = Object.entries(predictions).map(([match_key, scores]) => ({ username, match_key, home_score: scores.home, away_score: scores.away }))
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
          <button key={tab} onClick={() => setActiveTab(tab)} style={{padding:'8px 14px',borderRadius:'8px',border:'none',background:activeTab===tab?'#e63946':'#333',color:'white',cursor:'pointer',textTransform:'capitalize',fontSize:'0.9rem'}}>{tab}</button>
        ))}
      </div>

      {activeTab==='predictions' && (
        <div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px'}}>
            {GROUPS.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)} style={{width:'36px',height:'36px',borderRadius:'50%',border:'none',background:activeGroup===g?'#e63946':'#333',color:'white',cursor:'pointer',fontWeight:'bold'}}>{g}</button>
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
                const color = pts===3?'#2ecc71':pts===2?'#f39c12':pts===-1?'#e63946':'#aaa'
                const label = pts===3?'🎯 +3':pts===2?'↔️ +2':pts===-1?'❌ -1':'0'
                pointsBadge = <span style={{fontSize:'0.75rem',color,fontWeight:'bold',marginLeft:'6px'}}>{label}</span>
              }
              return (
                <div key={key} style={{background:'#16213e',borderRadius:'10px',padding:'12px',opacity:locked?0.85:1}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontSize:'0.8rem',flex:1,textAlign:'right'}}>{home}</span>
                    <div style={{display:'flex',alignItems:'center',gap:'6px',margin:'0 8px'}}>
                      {locked ? (
                        <span style={{fontWeight:'bold',fontSize:'1rem',color:'#aaa'}}>{p?.home??'-'} - {p?.away??'-'} 🔒</span>
                      ) : (
                        <>
                          <input type="number" min="0" max="20" value={p?.home||''} onChange={e=>setScore(key,'home',e.target.value)} style={{width:'40px',textAlign:'center',padding:'4px',borderRadius:'6px',border:'none',fontSize:'1rem'}} placeholder="0"/>
                          <span>-</span>
                          <input type="number" min="0" max="20" value={p?.away||''} onChange={e=>setScore(key,'away',e.target.value)} style={{width:'40px',textAlign:'center',padding:'4px',borderRadius:'6px',border:'none',fontSize:'1rem'}} placeholder="0"/>
                        </>
                      )}
                    </div>
                    <span style={{fontSize:'0.8rem',flex:1}}>{away}</span>
                  </div>
                  {real && (
                    <div style={{textAlign:'center',marginTop:'6px',fontSize:'0.8rem'}}>
                      <span style={{color:'#aaa'}}>Real: </span>
                      <span style={{fontWeight:'bold'}}>{real.home} - {real.away}</span>
                      <span style={{color:'#aaa',marginLeft:'4px'}}>{real.status==='FINISHED'?'✅ FT':'🔴 LIVE'}</span>
                      {pointsBadge}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <button onClick={savePredictions} style={{marginTop:'16px',width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#2ecc71',color:'white',fontSize:'1rem',cursor:'pointer'}}>{saved?'✅ Saved!':'Save Predictions'}</button>
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