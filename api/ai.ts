import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from './lib/db.js';
import { setCorsHeaders } from './lib/cors.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.GROQ_API_KEY;
const SITE_BASE_URL = 'https://orbitsaas.cloud';

// ─── Action: Chat ───
async function handleChat(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Missing or invalid messages array' });
    if (!API_KEY) return res.status(500).json({ error: 'AI configuration missing' });

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages,
            temperature: 0.7,
            max_tokens: 500,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API Error:', errorData);
        throw new Error(`Groq API failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    return res.status(200).json({ success: true, content });
}

// ─── Action: Chatbot Context ───
function buildKnowledgeBase(content: Record<string, any>, lang: string): string {
    let kb = '';
    const hero = content.hero;
    if (hero) kb += `IDENTITY: ${hero.title}. "${hero.tagline}". ${hero.subtitle}\n`;

    const projects = content.projects?.items || [];
    if (projects.length > 0) {
        kb += "PROJECTS (USE THESE EXACT LINKS ONLY):\n";
        projects.forEach((p: any, index: number) => {
            const projectId = p.id || index;
            const tags = (p.tags || []).join(', ');
            kb += `- ${p.title} (${tags}): ${SITE_BASE_URL}/project/${projectId}\n`;
        });
    }

    const services = content.services?.items || [];
    if (services.length > 0) kb += "SERVICES: " + services.map((s: any) => s.title).join(', ') + "\n";

    const ts = content.techStack;
    if (ts) {
        const items = ts.items || [];
        if (items.length > 0) kb += "TECH: " + items.map((t: any) => t.name || t).join(', ') + "\n";
    }

    const whyUs = content.whyUs?.items || [];
    if (whyUs.length > 0) kb += "WHY US: " + whyUs.map((w: any) => w.title).join(', ') + "\n";

    const leadership = content.leadership?.members || [];
    if (leadership.length > 0) kb += "TEAM: " + leadership.map((l: any) => `${l.name} (${l.role})`).join(', ') + "\n";

    const footer = content.footer;
    if (footer) {
        const activeSocials = (footer.socials || []).filter((s: any) => s.enabled && s.url);
        if (activeSocials.length > 0) kb += "SOCIALS: " + activeSocials.map((s: any) => `${s.platform}: ${s.url}`).join(', ') + "\n";
    }

    kb += `CORE LINKS: Home: ${SITE_BASE_URL} | Projects: ${SITE_BASE_URL}/project | Contact: ${SITE_BASE_URL}/#contact\n`;

    const linksData = content.links?.items || [];
    if (linksData.length > 0) kb += "ADDITIONAL LINKS:\n" + linksData.map((l: any) => `- ${l.title}: ${l.link}`).join('\n') + "\n";

    return kb;
}

async function generateGist(knowledgeBase: string): Promise<string | null> {
    if (!API_KEY) return null;
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a technical documentator. Summarize the following company knowledge base into a SHORT factual reference (~150 words max). CRITICAL: All URLs and proper names (Project Titles, Service Names) must be preserved EXACTLY as in the source. NEVER synthesize new categories like "PROJECT SHOWCASE" or "AI SERVICES". NEVER abbreviate or abbreviate URLs. If the source says "LifeSolver: https://site.com/project/1", keep it exactly like that. NO marketing fluff. Output ONLY the summary.'
                    },
                    { role: 'user', content: knowledgeBase }
                ],
                temperature: 0.2,
                max_tokens: 300,
            }),
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || null;
    } catch { return null; }
}

async function handleContext(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const lang = (req.query.lang as string) || 'en';
    const forceRefresh = req.query.refresh === 'true';

    if (forceRefresh) {
        try { await db.execute({ sql: 'DELETE FROM kb_gist WHERE lang = ?', args: [lang] }); } catch { /* skip */ }
    }

    let content: Record<string, any> = {};

    // Try cache first
    try {
        const cacheResult = await db.execute({ sql: 'SELECT data FROM content_cache WHERE lang = ?', args: [lang] });
        if (cacheResult.rows.length > 0) content = JSON.parse(cacheResult.rows[0].data as string);
    } catch { /* skip */ }

    // Fallback: assemble from sections
    if (Object.keys(content).length === 0) {
        const result = await db.execute({ sql: 'SELECT section, data FROM site_content WHERE lang = ?', args: [lang] });
        for (const row of result.rows) content[row.section as string] = JSON.parse(row.data as string);
    }

    // Try cached gist
    let knowledgeBase = '';
    try {
        const gistResult = await db.execute({ sql: 'SELECT gist FROM kb_gist WHERE lang = ?', args: [lang] });
        if (gistResult.rows.length > 0 && (gistResult.rows[0] as any).gist) {
            knowledgeBase = (gistResult.rows[0] as any).gist as string;
        }
    } catch { /* skip */ }

    // Generate gist if missing
    if (!knowledgeBase) {
        const fullKB = buildKnowledgeBase(content, lang);
        let leadInfo = '';
        try {
            const leadResult = await db.execute('SELECT COUNT(*) as count FROM leads');
            const count = Number(leadResult.rows[0]?.count ?? 0);
            if (count > 0) leadInfo = `\nLEAD STATS: ${count} total leads captured.\n`;
        } catch { /* skip */ }

        const fullKBWithLeads = fullKB + leadInfo;
        const gist = await generateGist(fullKBWithLeads);

        if (gist) {
            knowledgeBase = gist;
            try {
                await db.execute({ sql: `CREATE TABLE IF NOT EXISTS kb_gist (lang TEXT PRIMARY KEY, gist TEXT NOT NULL, updated_at TEXT DEFAULT (datetime('now')))` });
                await db.execute({
                    sql: `INSERT INTO kb_gist (lang, gist, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(lang) DO UPDATE SET gist = ?, updated_at = datetime('now')`,
                    args: [lang, gist, gist],
                });
            } catch { /* skip */ }
        } else {
            knowledgeBase = fullKBWithLeads;
        }
    }

    const chatbot = content.chatbot || {};
    const sanitizedKB = knowledgeBase.replace(/orbitsaas-projects|orbitsaas-team/g, 'orbitsaas.cloud');
    const qaPairs = (chatbot.qaPairs || [])
        .map((qa: { question: string; answer: string }) => `Q: ${qa.question}\nA: ${qa.answer}`)
        .join('\n\n');

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return res.status(200).json({
        success: true,
        knowledgeBase: sanitizedKB,
        qaPairs: qaPairs || null,
        systemPrompt: chatbot.systemPrompt || null,
        lang,
    });
}

// ─── Action: Enhance ───
async function handleEnhance(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { isAuthorized } = await import('./lib/auth.js');
    if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });

    const { text, lang } = req.body;
    if (!text || !lang) return res.status(400).json({ error: 'Missing text or lang' });
    if (!API_KEY) return res.status(500).json({ error: 'AI configuration missing' });

    const systemPrompt = lang === 'en'
        ? "You are a professional copywriter for ORBIT SaaS. Your goal is to refine and compact the user's input. Make it more professional, high-impact, and premium. Keep it extremely concise (compact). Use active voice. If the input contains HTML tags, PRESERVE them. Return ONLY the refined text, no preamble."
        : "আপনি ORBIT SaaS-এর একজন পেশাদার কপিরাইটার। আপনার লক্ষ্য হলো ইউজারের ইনপুটকে আরও মার্জিত, পেশাদার এবং প্রিমিয়াম করা। কথাগুলো খুব সংক্ষিপ্ত কিন্তু আকর্ষণীয় রাখুন। যদি ইনপুটে HTML ট্যাগ থাকে, সেগুলো পরিবর্তন করবেন না। শুধুমাত্র সংশোধিত টেক্সটটি রিটার্ন করুন, অন্য কোনো কথা বলবেন না।";

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
            ],
            temperature: 0.5,
            max_tokens: 512,
        }),
    });

    if (!response.ok) throw new Error(`Groq API failed: ${response.statusText}`);

    const data = await response.json();
    const enhancedText = data.choices[0]?.message?.content?.trim() || text;
    return res.status(200).json({ success: true, enhancedText });
}

// ─── Main Router ───
export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();

    const action = (req.query.action as string) || '';

    try {
        switch (action) {
            case 'chat': return await handleChat(req, res);
            case 'context': return await handleContext(req, res);
            case 'enhance': return await handleEnhance(req, res);
            default: return res.status(400).json({ error: 'Unknown action. Use ?action=chat|context|enhance' });
        }
    } catch (error) {
        console.error('AI API error:', error);
        return res.status(500).json({ error: 'Failed to process AI request' });
    }
}
