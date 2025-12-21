/**
 * Simple Health Check Endpoint
 */

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    return new Response(
      JSON.stringify({
        status: 'ok',
        apiKeySet: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 10) : 'NOT_SET',
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  return new Response(
    JSON.stringify({
      status: 'ok',
      apiKeySet: !!apiKey,
      message: 'POST to test the API key'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
