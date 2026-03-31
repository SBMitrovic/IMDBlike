import type { Handler } from '@netlify/functions';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

interface TmdbRequest {
  endpoint: string;
  params?: Record<string, any>;
}

// TMDB Proxy - Bearer token ostaje na backend-u (SKRIT!)
const handler: Handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: 'ok'
    };
  }

  // Samo GET i POST
  if (!['GET', 'POST'].includes(event.httpMethod || '')) {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body: TmdbRequest = JSON.parse(event.body || '{}');
    const { endpoint, params = {} } = body;

    if (!endpoint) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Endpoint je obavezna' })
      };
    }

    // Validiraj endpoint - samo dozvoljene rute
    const allowedEndpoints = [
      '/movie/top_rated',
      '/movie/now_playing',
      '/movie/upcoming',
      '/search/movie',
      '/movie/',
      '/discover/movie',
      '/person/',
      '/genre/movie/list'
    ];

    const isAllowed = allowedEndpoints.some(allowed => endpoint.includes(allowed));

    if (!isAllowed) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Endpoint nije dozvoljena' })
      };
    }

    // Pripremi URL sa parametrima
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`;

    console.log(`🎬 TMDB Proxy Request: ${endpoint}`);

    // Napravi zahtjev sa Bearer tokenom (OVDJE JE SKRIT NA BACKEND-U!)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': BEARER_TOKEN || '',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Ako je greška, vrati je
    if (!response.ok) {
      console.error(`❌ TMDB Error:`, data);
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify(data)
      };
    }

    console.log(`✅ TMDB Success: ${endpoint}`);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data)
    };

  } catch (error: any) {
    console.error('❌ Proxy Error:', error.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

export { handler };