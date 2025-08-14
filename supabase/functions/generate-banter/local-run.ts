// Usage:
//   deno run -A --env supabase/functions/generate-banter/local-run.ts "https://example.com/image.jpg"
//
// Environment:
//   OPENAI_API_KEY=... [required]
//   OPENAI_MODEL=...   [optional, defaults to gpt-4o-mini]

import { generateBanterFromImage } from "./banter.ts"

if (import.meta.main) {
  const imageUrl = Deno.args[0]
  if (!imageUrl) {
    console.error("Missing argument: imageUrl")
    console.error("Example: deno run -A --env supabase/functions/generate-banter/local-run.ts https://example.com/image.jpg")
    Deno.exit(1)
  }

  try {
    const { excerpts } = await generateBanterFromImage(imageUrl)
    console.log("Excerpts:\n")
    for (const [index, ex] of excerpts.entries()) {
      console.log(`${index + 1}. ${ex.text}`)
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error))
    Deno.exit(1)
  }
}


