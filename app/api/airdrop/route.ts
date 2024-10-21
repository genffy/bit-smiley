export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const res = await fetch(`https://apis.bitsmiley.io/airdrop/getMyBitSmileyJourney/${address}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  return Response.json({ data })
}