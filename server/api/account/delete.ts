import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

// Deletes the authenticated user's Supabase account. `games` and `player_profiles`
// both reference auth.users with `on delete cascade`, so removing the user is
// enough to remove all of their associated data.
export default defineEventHandler(async (event) => {
  const claims = await serverSupabaseUser(event)
  if (!claims?.sub) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const client = serverSupabaseServiceRole(event)
  const { error } = await client.auth.admin.deleteUser(claims.sub)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true }
})