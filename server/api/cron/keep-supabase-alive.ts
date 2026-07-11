import { serverSupabaseClient } from '#supabase/server'

// Supabase's free tier pauses a project after 7 days without API activity.
// Vercel Cron hits this route on a daily schedule (see vercel.json) to keep
// it awake — a single filtered/empty read is enough to count as activity.
export default defineEventHandler(async (event) => {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && getHeader(event, 'authorization') !== `Bearer ${cronSecret}`) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const client = await serverSupabaseClient(event)
  const { error } = await client.from('player_profiles').select('id').limit(1)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true, pingedAt: new Date().toISOString() }
})