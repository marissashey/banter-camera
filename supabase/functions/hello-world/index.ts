// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name} from hello-world edge function!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* 

Project id:
ixlqkyljxnqukdoossin

To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer <INSERT_DEV_ANON_KEY_HERE_FROM_CLI_SUPABASE_STATUS>' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'


  https://ixlqkyljxnqukdoossin.supabase.co/functions/v1/hello-world


To test live function: (step 7: https://supabase.com/docs/guides/functions/quickstart)

  curl --request POST 'https://ixlqkyljxnqukdoossin.supabase.co/functions/v1/hello-world' \
  --header 'Authorization: Bearer <INSERT_PROD_ANON_KEY_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Production"}'


*/
