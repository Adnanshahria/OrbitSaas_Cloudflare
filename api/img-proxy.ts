import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './lib/cors.js';

// Allowed external image domains
const ALLOWED_DOMAINS = [
    'i.ibb.co',
    'i.imgbb.com',
    'image.ibb.co',
];

function isAllowedUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ALLOWED_DOMAINS.some(d => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`));
    } catch {
        return false;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.query;
    const imageUrl = Array.isArray(url) ? url[0] : url;

    if (!imageUrl || !isAllowedUrl(imageUrl)) {
        return res.status(400).json({ error: 'Invalid or disallowed image URL' });
    }

    try {
        const upstream = await fetch(imageUrl, {
            headers: { 'Accept': 'image/*' },
        });

        if (!upstream.ok) {
            return res.status(upstream.status).json({ error: 'Upstream image fetch failed' });
        }

        const contentType = upstream.headers.get('content-type') || 'image/jpeg';
        const buffer = Buffer.from(await upstream.arrayBuffer());

        // Long-lived cache: Vercel CDN caches for 1 year, browser caches for 1 day
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, immutable');
        res.setHeader('CDN-Cache-Control', 'public, s-maxage=31536000, immutable');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', buffer.length);

        return res.status(200).send(buffer);
    } catch (error) {
        console.error('Image proxy error:', error);
        return res.status(500).json({ error: 'Image proxy failed' });
    }
}
