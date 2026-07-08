export async function GET() {
  try {
    const res = await fetch('https://worldcup26.ir/get/games', { cache: 'no-store' })
    const data = await res.json()

    const matches = (Array.isArray(data) ? data : data.games || []).map((item: any) => {
      let status = 'SCHEDULED'
      const s = item.status || ''
      if (['finished','completed','FT'].includes(s)) status = 'FINISHED'
      else if (s === 'HT') status = 'PAUSED'
      else if (['live','in_play','1H','2H'].includes(s)) status = 'IN_PLAY'

      const group = item.group ? `GROUP_${item.group}` : null

      return {
        utcDate: item.date || item.kickoff,
        status,
        group,
        homeTeam: { name: item.home_team || item.team1 },
        awayTeam: { name: item.away_team || item.team2 },
        score: {
          fullTime: {
            home: item.home_score ?? item.score?.home ?? null,
            away: item.away_score ?? item.score?.away ?? null
          }
        }
      }
    })

    return Response.json({ matches })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}