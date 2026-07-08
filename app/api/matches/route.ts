export async function GET() {
  try {
    const [gamesRes, teamsRes] = await Promise.all([
      fetch('https://worldcup26.ir/get/games', { cache: 'no-store' }),
      fetch('https://worldcup26.ir/get/teams', { cache: 'no-store' })
    ])
    const gamesData = await gamesRes.json()
    const teamsData = await teamsRes.json()

    const teamMap: Record<number, string> = {}
    const teams = Array.isArray(teamsData) ? teamsData : teamsData.teams || []
    teams.forEach((t: any) => {
      teamMap[t.id] = t.name
    })

    const games = Array.isArray(gamesData) ? gamesData : gamesData.games || []

    const matches = games.map((item: any) => {
      let status = 'SCHEDULED'
      const s = item.status || ''
      if (['finished','completed','FT'].includes(s)) status = 'FINISHED'
      else if (s === 'HT') status = 'PAUSED'
      else if (['live','in_play','1H','2H'].includes(s)) status = 'IN_PLAY'

      const group = item.group ? `GROUP_${item.group}` : null
      const homeName = teamMap[item.home_team_id] || ''
      const awayName = teamMap[item.away_team_id] || ''

      return {
        utcDate: item.date || item.kickoff,
        status,
        group,
        homeTeam: { name: homeName },
        awayTeam: { name: awayName },
        score: {
          fullTime: {
            home: item.home_score ?? null,
            away: item.away_score ?? null
          }
        }
      }
    })

    return Response.json({ matches })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}