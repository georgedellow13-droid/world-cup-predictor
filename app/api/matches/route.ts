
export async function GET() {
  try {
    const res = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
      {
        headers: {
          'x-apisports-key': 'a8957f5855bf9f34ffcaca39eb0abdd5',
          'x-rapidapi-host': 'v3.football.api-sports.io'
        },
        cache: 'no-store'
      }
    )
    const data = await res.json()
    const matches = (data.response || []).map((item: any) => {
      const fixture = item.fixture
      const teams = item.teams
      const goals = item.goals
      const league = item.league

      let status = 'SCHEDULED'
      if (fixture.status.short === 'FT') status = 'FINISHED'
      else if (fixture.status.short === 'HT') status = 'PAUSED'
      else if (['1H','2H','ET','P'].includes(fixture.status.short)) status = 'IN_PLAY'

      return {
        utcDate: fixture.date,
        status,
        group: league.round?.startsWith('Group') ? `GROUP_${league.round.replace('Group ', '').trim()}` : null,
        homeTeam: { name: teams.home.name },
        awayTeam: { name: teams.away.name },
        score: {
          fullTime: {
            home: goals.home,
            away: goals.away
          }
        }
      }
    })

    return Response.json({ matches })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
