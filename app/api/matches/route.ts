const TEAM_NAMES: Record<number, string> = {
  1: 'Mexico', 2: 'South Africa', 3: 'Korea Republic', 4: 'Czechia',
  5: 'Canada', 6: 'Bosnia-Herzegovina', 7: 'Qatar', 8: 'Switzerland',
  9: 'Brazil', 10: 'Morocco', 11: 'Haiti', 12: 'Scotland',
  13: 'United States', 14: 'Paraguay', 15: 'Australia', 16: 'Turkey',
  17: 'Germany', 18: 'Curacao', 19: 'Ivory Coast', 20: 'Ecuador',
  21: 'Netherlands', 22: 'Japan', 23: 'Sweden', 24: 'Tunisia',
  25: 'Belgium', 26: 'Egypt', 27: 'Iran', 28: 'New Zealand',
  29: 'Spain', 30: 'Cape Verde Islands', 31: 'Saudi Arabia', 32: 'Uruguay',
  33: 'France', 34: 'Senegal', 35: 'Iraq', 36: 'Norway',
  37: 'Argentina', 38: 'Algeria', 39: 'Austria', 40: 'Jordan',
  41: 'Portugal', 42: 'Congo DR', 43: 'Uzbekistan', 44: 'Colombia',
  45: 'England', 46: 'Croatia', 47: 'Ghana', 48: 'Panama',
}

export async function GET() {
  try {
    const res = await fetch('https://worldcup26.ir/get/games', { cache: 'no-store' })
    const data = await res.json()
    const games = Array.isArray(data) ? data : data.games || []

    const matches = games.map((item: any) => {
      let status = 'SCHEDULED'
      const s = (item.status || '').toLowerCase()
      const hasScore = item.home_score !== null && item.home_score !== undefined
      const isLive = ['live','in_play','1h','2h'].includes(s)
      const isFinished = ['finished','completed','ft'].includes(s) || (hasScore && !isLive)

      if (isFinished) status = 'FINISHED'
      else if (s === 'ht') status = 'PAUSED'
      else if (isLive) status = 'IN_PLAY'

      const group = item.group ? `GROUP_${item.group}` : null

      return {
        utcDate: item.date || item.kickoff,
        status,
        group,
        homeTeam: { name: TEAM_NAMES[item.home_team_id] || '' },
        awayTeam: { name: TEAM_NAMES[item.away_team_id] || '' },
        score: {
          fullTime: {
            home: item.home_score !== null ? parseInt(item.home_score) : null,
            away: item.away_score !== null ? parseInt(item.away_score) : null
          }
        }
      }
    })

    return Response.json({ matches })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}