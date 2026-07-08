export async function GET() {
  try {
    const [gamesRes, teamsRes] = await Promise.all([
      fetch('https://worldcup26.ir/get/games', { cache: 'no-store' }),
      fetch('https://worldcup26.ir/get/teams', { cache: 'no-store' })
    ])
    const gamesData = await gamesRes.json()
    const teamsData = await teamsRes.json()

    return Response.json({ teamsData, gamesData })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}