import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json()

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        // Fetch the Luma event page HTML
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; bot/1.0)',
            },
        })

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch the event page. Check the URL.' }, { status: 400 })
        }

        const html = await res.text()

        // Helper: extract <meta> content by property or name
        const getMeta = (key: string): string | null => {
            const patterns = [
                new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
                new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, 'i'),
                new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
                new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, 'i'),
            ]
            for (const pattern of patterns) {
                const match = html.match(pattern)
                if (match) return match[1]
            }
            return null
        }

        // Extract JSON-LD structured data (Luma uses this for event details)
        const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
        let structuredData: Record<string, string> = {}
        if (jsonLdMatch) {
            try {
                const parsed = JSON.parse(jsonLdMatch[1])
                structuredData = parsed
            } catch { }
        }

        const decodeEntities = (str: string) => {
            if (!str) return ''

            // Handle multiple passes in case of double-encoding (e.g., &amp;amp;)
            let decoded = str
            for (let i = 0; i < 2; i++) {
                decoded = decoded
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&#x27;/g, "'")
                    .replace(/&rsquo;/g, "'")
                    .replace(/&#x2019;/g, "'")
                    .replace(/&#8217;/g, "'")
                    .replace(/&nbsp;/g, ' ')
            }
            return decoded
        }

        const title = decodeEntities(getMeta('og:title') || structuredData?.name || '')
        const description = decodeEntities(getMeta('og:description') || structuredData?.description || '')
        const image = getMeta('og:image') || structuredData?.image || ''

        // Date: Luma puts it in JSON-LD as startDate
        const rawDate = structuredData?.startDate || getMeta('event:start_time') || ''

        // Location: from JSON-LD
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const locationRaw = (structuredData as any)?.location
        const location =
            typeof locationRaw === 'object' && locationRaw !== null
                ? (locationRaw.name || '')
                : typeof locationRaw === 'string'
                    ? locationRaw
                    : ''

        return NextResponse.json({
            title: title.replace(' · Luma', '').trim(),
            description: description.trim(),
            image_url: image,
            date: rawDate,
            location,
            luma_url: url,
        })
    } catch (err) {
        console.error('fetch-event error:', err)
        return NextResponse.json({ error: 'Unexpected error fetching event data.' }, { status: 500 })
    }
}
