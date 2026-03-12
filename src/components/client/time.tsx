'use client'

export function ClientTime({ dateStr }: { dateStr: string | null }) {
  if (!dateStr) return <>Date TBD</>
  const d = new Date(dateStr)
  const date = d.toLocaleDateString('en-MY', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return <>{`${date}${time ? ` · ${time}` : ''}`}</>
}
