export async function GET(request) {
  return new Response(JSON.stringify({ message: 'Hello, world!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {

  return new Response(JSON.stringify({ message: 'User created' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}