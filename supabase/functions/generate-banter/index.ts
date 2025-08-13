// Supabase Edge Function: generate-banter
// Accepts { image_url: string } and returns { excerpts: Array<{ text: string }> }
// Uses OpenAI (GPT-5 by default, override with OPENAI_MODEL) to generate witty banter lines for the image.

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

type OpenAIChatMessage =
  | { role: 'system' | 'assistant' | 'user'; content: string }
  | {
      role: 'user'
      content: Array<
        | { type: 'text'; text: string }
        | { type: 'image_url'; image_url: { url: string } }
      >
    }

interface OpenAIChatResponse {
  choices: Array<{
    message: { content: string }
  }>
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

function isObjectWithText(value: unknown): value is { text: string } {
  if (typeof value !== 'object' || value === null) return false
  const rec = value as Record<string, unknown>
  return typeof rec.text === 'string'
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

  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) {
    return serverError('OPENAI_API_KEY is not configured')
  }

  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-5'

  const systemPrompt =
    'You are a witty, friendly banter writer. Given an image, produce 3-5 short, playful one-liners. Keep each under 140 characters, avoid profanity, be kind.'

  // Ask for strict JSON so we can parse reliably
  const userInstruction =
    'Return ONLY a JSON object with the shape {"excerpts":["..."]}. No extra text. The lines should reference the image in a light, fun way.'

  const messages: OpenAIChatMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: [
        { type: 'text', text: userInstruction },
        { type: 'image_url', image_url: { url: imageUrl } }
      ]
    }
  ]

  try {
    const completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    })

    if (!completionRes.ok) {
      const errText = await completionRes.text()
      return serverError(`OpenAI request failed: ${completionRes.status} ${errText}`)
    }

    const completionJson = (await completionRes.json()) as OpenAIChatResponse
    const content = completionJson?.choices?.[0]?.message?.content || ''

    type ParsedResponse = { excerpts: Array<string | { text: string }> }
    let parsed: ParsedResponse | null = null
    try {
      const tmp = JSON.parse(content)
      parsed = tmp as ParsedResponse
    } catch {
      // Try to salvage by extracting JSON substring
      const match = content.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const tmp = JSON.parse(match[0])
          parsed = tmp as ParsedResponse
        } catch {
          return serverError('Failed to parse JSON response from OpenAI')
        }
      } else {
        return serverError('OpenAI response did not contain JSON content')
      }
    }

    const rawExcerpts: Array<string | { text: string }> = Array.isArray(parsed?.excerpts) ? parsed!.excerpts : []
    if (!Array.isArray(rawExcerpts) || rawExcerpts.length === 0) {
      return serverError('OpenAI returned no excerpts')
    }

    const excerpts = rawExcerpts
      .map((item) =>
        typeof item === 'string' ? { text: item } :
        isObjectWithText(item) ? { text: item.text } : null
      )
      .filter((x): x is { text: string } => x !== null)

    if (!excerpts.length) {
      return serverError('No valid excerpts produced')
    }

    return ok({ excerpts })
  } catch (err) {
    return serverError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
  }
})
