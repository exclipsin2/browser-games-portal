import { NextApiRequest, NextApiResponse } from 'next'

// Very small proxy skeleton. For production, move this to a dedicated service and
// harden further. This blocks private IP ranges and requires an allowlist.

const ALLOWLIST = (process.env.PROXY_ALLOWLIST || '').split(',').map(s=>s.trim()).filter(Boolean)

function isPrivateIP(hostname: string){
  // Basic check — in production use a robust IP resolver and CIDR checks
  if (!hostname) return true
  if (hostname.startsWith('127.') || hostname.startsWith('10.') || hostname.startsWith('192.168') || hostname === 'localhost') return true
  return false
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const url = req.query.url as string
  if (!url) return res.status(400).json({ error: 'missing url' })
  try{
    const parsed = new URL(url)
    if (isPrivateIP(parsed.hostname)) return res.status(403).json({ error: 'blocked' })
    if (ALLOWLIST.length && !ALLOWLIST.includes(parsed.hostname)) return res.status(403).json({ error: 'host not allowed' })

    const controller = new AbortController()
    const timeout = setTimeout(()=>controller.abort(), 5000)
    const r = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    const text = await r.text()
    res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(text)
  }catch(err:any){
    res.status(500).json({ error: err.message || 'fetch error' })
  }
}
