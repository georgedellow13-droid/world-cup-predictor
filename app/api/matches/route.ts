export async function GET() {
  const res = await fetch(
    'https://api.football-data.org/v4/competitions/WC/matches',
    {
      headers: {
        'X-Auth-Token': process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || '',
      },
      next: { revalidate: 60 },
    }
  );

  const data = await res.json();
  return Response.json(data);
}