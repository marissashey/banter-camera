// Supabase Edge Function: generate-banter
// Accepts { image_url: string } and returns { excerpts: Array<{ text: string }> }
// Uses OpenAI (defaults to gpt-4o-mini, override with OPENAI_MODEL) to generate witty banter lines for the image.

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { generateBanterFromImage } from "./banter.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}


function ok(json: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(json), {
    ...init,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', ...(init.headers || {}) }
  })
}

function badRequest(message: string) {
  return ok({ error: message }, { status: 400 })
}

function serverError(message: string) {
  return ok({ error: message }, { status: 500 })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return badRequest('Only POST is supported')
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Invalid JSON in request body')
  }

  const imageUrl: string | undefined = (typeof body === 'object' && body !== null && 'image_url' in body)
    ? (body as { image_url?: unknown }).image_url as string | undefined
    : undefined
  if (!imageUrl || typeof imageUrl !== 'string') {
    return badRequest('Missing required field: image_url')
  }

  try {
    const { excerpts } = await generateBanterFromImage(imageUrl)
    return ok({ excerpts })
  } catch (err) {
    return serverError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
  }
})
