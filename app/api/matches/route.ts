
export async function GET() {
  try {
    const res = await fetch(
      'https://api.zafronix.com/fifa/worldcup/v1/tournaments/2026/matches',
      {
        headers: {
          'X-API-Key': 'zwc_free_5c961348d89798d55c5eb4e8'
        },
        cache: 'no-store'
      }
    )
    const data = await res.json()

    const matches = (data.matches || data || []).map((item: any) => {
      let status = 'SCHEDULED'
      if (item.status === 'FT' || item.status === 'completed' || item.phase === 'FT') status = 'FINISHED'
      else if (item.status === 'HT' || item.phase === 'HT') status = 'PAUSED'
      else if (['1H','2H','ET','P','IN_PLAY','live'].includes(item.status || item.phase)) status = 'IN_PLAY'

      return {
        utcDate: item.kickoff_utc || item.date,
        status,
        group: item.group_name ? `GROUP_${item.group_name}` : null,
        homeTeam: { name: item.home_team },
        awayTeam: { name: item.away_team },
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