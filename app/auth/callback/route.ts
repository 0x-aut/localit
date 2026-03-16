import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has any groups
      const { data: groups } = await supabase
        .from('group_members')
        .select('group_id')
        .limit(1)

      // No groups → onboarding, otherwise → dashboard
      if (!groups || groups.length === 0) {
        return NextResponse.redirect(new URL('/onboarding', origin))
      }

      const { data: group } = await supabase
        .from('groups')
        .select('id')
        .limit(1)
        .single()

      return NextResponse.redirect(
        new URL(`/groups/${group?.id}/`, origin)
      )
    }
  }

  // Something went wrong → back to home
  return NextResponse.redirect(new URL('/', origin))
}