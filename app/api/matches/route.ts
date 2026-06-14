export async function GET() {
  try {
    const res = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches?stage=GROUP_STAGE',
      { headers: { 'X-Auth-Token': '9b6fbc82d34943f29e3678a68945cbc4' } }
    )
    const data = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}