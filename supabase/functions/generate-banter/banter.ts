import OpenAI from "jsr:@openai/openai"

export type BanterExcerpt = { text: string }

export const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini'

/**
 * Generate witty banter lines for a given image URL using OpenAI.
 */
export async function generateBanterFromImage(
  imageUrl: string,
  options: {
    apiKey?: string
    model?: string
    temperature?: number
    systemPromptOverride?: string
  } = {}
): Promise<{ excerpts: BanterExcerpt[] }> {
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('Missing required field: image_url')
  }

  const apiKey = options.apiKey ?? Deno.env.get('OPENAI_API_KEY') ?? ''
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const model = options.model ?? Deno.env.get('OPENAI_MODEL') ?? DEFAULT_OPENAI_MODEL
  const temperature = options.temperature ?? 0.7

  const systemPrompt =
    options.systemPromptOverride ??
    'You are a witty, friendly banter writer. Given an image, produce 3-5 short, playful one-liners. Keep each under 140 characters, avoid profanity, be kind.'

  const userInstruction =
    'Return ONLY JSON with shape {"excerpts":["..."]}. 3-5 items. Each under 140 chars. Light, kind, playful. Reference the image context.'

  const openai = new OpenAI({ apiKey })

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: userInstruction },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'low' } }
        ]
      }
    ],
    temperature,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'banter_schema',
        schema: {
          type: 'object',
          properties: {
            excerpts: {
              type: 'array',
              items: { type: 'string' },
              minItems: 3,
              maxItems: 5
            }
          },
          required: ['excerpts'],
          additionalProperties: false
        },
        strict: true
      }
    }
  })

  const content = completion?.choices?.[0]?.message?.content || ''

  let parsed: { excerpts?: string[] } | null = null
  try {
    parsed = JSON.parse(content)
  } catch (_e) {
    throw new Error('Failed to parse JSON from OpenAI structured output')
  }

  const rawExcerpts: string[] = Array.isArray(parsed?.excerpts) ? parsed!.excerpts : []
  if (!Array.isArray(rawExcerpts) || rawExcerpts.length === 0) {
    throw new Error('OpenAI returned no excerpts')
  }

  const excerpts: BanterExcerpt[] = rawExcerpts
    .map((text) => (typeof text === 'string' ? { text } : null))
    .filter((x): x is BanterExcerpt => x !== null)

  if (!excerpts.length) {
    throw new Error('No valid excerpts produced')
  }

  return { excerpts }
}


