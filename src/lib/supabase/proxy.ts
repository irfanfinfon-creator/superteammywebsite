import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    type CookieOptions = {
        expires?: Date
        maxAge?: number
        path?: string
        domain?: string
        secure?: boolean
        httpOnly?: boolean
        sameSite?: 'lax' | 'strict' | 'none'
    }

    type SupabaseCookie = {
        name: string
        value: string
        options?: CookieOptions
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: SupabaseCookie[]) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If there's a user, check if they exist in admin_users table
    let role = null
    if (user) {
        const { data: adminData } = await supabase
            .from('admin_users')
            .select('role')
            .eq('id', user.id)
            .single()

        role = adminData?.role || null
    }

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // If no user OR user has no admin role, redirect to login
        if (!user || !role) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            // If user is logged in but not an admin, maybe sign them out or show error
            // For now, redirecting to login is safest
            return NextResponse.redirect(url)
        }
    }

    // Redirect /login to /admin if user is already logged in AND is an admin
    if (
        user &&
        role &&
        request.nextUrl.pathname.startsWith('/login')
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
    }

    return response
}
