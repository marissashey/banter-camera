// Dummy endpoint for generate-banter
// Takes an image_url and returns a banter_text in Chinese

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const { image_url } = await req.json()

    // Validate that image_url is provided
    if (!image_url) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field: image_url'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Return the dummy banter text in Chinese
    const response = {
      banter_text: "嗯，你这张图片很有趣！"
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (_error) {
    return new Response(
      JSON.stringify({
        error: 'Invalid JSON in request body'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
