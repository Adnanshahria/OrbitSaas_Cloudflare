import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from './lib/db.js';
import { setCorsHeaders } from './lib/cors.js';

// Extract all image URLs from content data recursively
function extractImageUrls(obj: unknown, urls: Set<string> = new Set()): Set<string> {
    if (!obj) return urls;
    if (typeof obj === 'string') {
        if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|avif)/i.test(obj) ||
            /i\.ibb\.co|i\.imgbb\.com|image\.ibb\.co/i.test(obj)) {
            urls.add(obj);
        }
        return urls;
    }
    if (Array.isArray(obj)) {
        for (const item of obj) extractImageUrls(item, urls);
        return urls;
    }
    if (typeof obj === 'object') {
        for (const value of Object.values(obj as Record<string, unknown>)) {
            extractImageUrls(value, urls);
        }
    }
    return urls;
}

// Helper: send a progress line (NDJSON)
function sendProgress(res: VercelResponse, progress: number, status: string, extra?: Record<string, unknown>) {
    res.write(JSON.stringify({ progress: Math.round(progress), status, ...extra }) + '\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // GET: Check cache status
        if (req.method === 'GET') {
            const result = await db.execute(
                `SELECT lang, updated_at FROM content_cache ORDER BY lang`
            );
            const status: Record<string, string> = {};
            for (const row of result.rows) {
                status[row.lang as string] = row.updated_at as string;
            }
            return res.status(200).json({
                success: true,
                cached: Object.keys(status).length > 0,
                languages: status,
            });
        }

        // POST: Build and save cache + warm images (streamed progress)
        if (req.method === 'POST') {
            const { isAuthorized } = await import('./lib/auth.js');
            if (!isAuthorized(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Stream NDJSON progress
            res.setHeader('Content-Type', 'application/x-ndjson');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Transfer-Encoding', 'chunked');
            res.status(200);

            // Step 1: Create table (5%)
            sendProgress(res, 2, 'Preparing cache table...');
            await db.execute(`
                CREATE TABLE IF NOT EXISTS content_cache (
                    lang TEXT PRIMARY KEY,
                    data TEXT NOT NULL,
                    updated_at TEXT DEFAULT (datetime('now'))
                )
            `);
            sendProgress(res, 5, 'Cache table ready');

            // Step 2: Build cache per language (5% → 40%)
            const languages = ['en', 'bn'];
            const allImageUrls = new Set<string>();

            for (let li = 0; li < languages.length; li++) {
                const lang = languages[li];
                const langProgress = 5 + ((li + 0.5) / languages.length) * 35;
                sendProgress(res, langProgress, `Caching ${lang.toUpperCase()} content...`);

                const result = await db.execute({
                    sql: 'SELECT section, data FROM site_content WHERE lang = ?',
                    args: [lang],
                });

                const content: Record<string, unknown> = {};
                for (const row of result.rows) {
                    const parsed = JSON.parse(row.data as string);
                    content[row.section as string] = parsed;
                    extractImageUrls(parsed, allImageUrls);
                }

                await db.execute({
                    sql: `INSERT INTO content_cache (lang, data, updated_at)
                          VALUES (?, ?, datetime('now'))
                          ON CONFLICT(lang) DO UPDATE SET data = ?, updated_at = datetime('now')`,
                    args: [lang, JSON.stringify(content), JSON.stringify(content)],
                });

                const langDoneProgress = 5 + ((li + 1) / languages.length) * 35;
                sendProgress(res, langDoneProgress, `${lang.toUpperCase()} content cached`);
            }

            // Step 3: Invalidate AI gists (40% → 45%)
            sendProgress(res, 42, 'Clearing AI gists...');
            try {
                await db.execute('DELETE FROM kb_gist');
            } catch {
                // kb_gist table might not exist
            }
            sendProgress(res, 45, 'AI gists cleared');

            // Step 4: Warm images (45% → 90%)
            const imageUrls = Array.from(allImageUrls);
            let imagesWarmed = 0;

            if (imageUrls.length > 0) {
                const batchSize = 5;
                const totalBatches = Math.ceil(imageUrls.length / batchSize);

                for (let i = 0; i < imageUrls.length; i += batchSize) {
                    const batchIndex = Math.floor(i / batchSize);
                    const batchProgress = 45 + ((batchIndex + 0.5) / totalBatches) * 45;
                    sendProgress(res, batchProgress, `Warming images ${i + 1}-${Math.min(i + batchSize, imageUrls.length)} of ${imageUrls.length}...`);

                    const batch = imageUrls.slice(i, i + batchSize);
                    await Promise.allSettled(
                        batch.map(url =>
                            fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
                                .then(r => { if (r.ok) imagesWarmed++; })
                        )
                    );

                    const batchDoneProgress = 45 + ((batchIndex + 1) / totalBatches) * 45;
                    sendProgress(res, batchDoneProgress, `Warmed ${imagesWarmed} images so far`);
                }
            } else {
                sendProgress(res, 90, 'No images to warm');
            }

            // Step 5: Warm CDN (90% → 98%)
            sendProgress(res, 92, 'Warming CDN cache...');
            try {
                const baseUrl = `https://${req.headers.host}`;
                await Promise.allSettled(
                    languages.map(lang =>
                        fetch(`${baseUrl}/api/content?lang=${lang}`, {
                            method: 'GET',
                            signal: AbortSignal.timeout(5000),
                        })
                    )
                );
            } catch {
                // CDN warming is best-effort
            }
            sendProgress(res, 98, 'CDN cache warmed');

            // Done (100%)
            sendProgress(res, 100, 'Cache published successfully', {
                done: true,
                cachedAt: new Date().toISOString(),
                imagesFound: imageUrls.length,
                imagesWarmed,
            });

            return res.end();
        }

        // DELETE: Clear all cache (streamed progress)
        if (req.method === 'DELETE') {
            const { isAuthorized } = await import('./lib/auth.js');
            if (!isAuthorized(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            res.setHeader('Content-Type', 'application/x-ndjson');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Transfer-Encoding', 'chunked');
            res.status(200);

            sendProgress(res, 10, 'Clearing content cache...');
            let rowsDeleted = 0;
            try {
                const result = await db.execute('DELETE FROM content_cache');
                rowsDeleted = result.rowsAffected;
            } catch {
                // Table might not exist
            }
            sendProgress(res, 50, 'Content cache cleared');

            sendProgress(res, 60, 'Clearing AI gists...');
            try {
                await db.execute('DELETE FROM kb_gist');
            } catch {
                // kb_gist might not exist
            }
            sendProgress(res, 90, 'AI gists cleared');

            sendProgress(res, 100, 'Cache cleared successfully', {
                done: true,
                rowsDeleted,
                clearedAt: new Date().toISOString(),
            });

            return res.end();
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Cache API error:', error);
        return res.status(500).json({
            error: 'Cache operation failed'
        });
    }
}
