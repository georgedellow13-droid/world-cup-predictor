export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get('team');

  const res = await fetch(
    `https://api-football-v1.p.rapidapi.com/v3/players/squads?team=${team}`,
    {
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
      next: { revalidate: 86400 },
    }
  );

  const data = await res.json();
  return Response.json(data);
}