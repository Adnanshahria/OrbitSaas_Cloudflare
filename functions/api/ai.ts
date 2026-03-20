import { getDb } from '../_lib/db';
import { getCorsHeaders, handleOptions, jsonResponse } from '../_lib/cors';
import { isAuthorized } from '../_lib/auth';
import type { Env } from '../_lib/types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SITE_BASE_URL = 'https://orbitsaas.cloud';

// ─── AI Helper: Primary (DeepSeek) with Fallback (Groq) ───
async function executeAiRequest(
    messages: unknown[],
    env: Env,
    options: {
        deepseekModel: string;
        groqModel: string;
        temperature: number;
        max_tokens: number;
    }
): Promise<{ content: string; source: string }> {
    let source = 'deepseek';
    
    if (env.AGENT_ROUTER_API_KEY) {
        try {
            const dsRes = await fetch('https://agentrouter.org/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.AGENT_ROUTER_API_KEY}`,
                },
                body: JSON.stringify({
                    model: options.deepseekModel,
                    messages,
                    temperature: options.temperature,
                    max_tokens: options.max_tokens,
                }),
            });
            
            if (dsRes.ok) {
                const data = await dsRes.json() as any;
                const content = data.choices?.[0]?.message?.content;
                if (content) return { content, source: `DeepSeek (${options.deepseekModel})` };
            } else {
                const errorText = await dsRes.text().catch(() => 'No error body');
                console.warn(`[AI Fallback] DeepSeek (AgentRouter) failed with status ${dsRes.status}: ${errorText}`);
            }
        } catch (e: any) {
            console.warn(`[AI Fallback] DeepSeek request failed: ${e.message}`);
        }
    }

    if (!env.GROQ_API_KEY) throw new Error('AI configuration missing');

    const grRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: options.groqModel,
            messages,
            temperature: options.temperature,
            max_tokens: options.max_tokens,
        }),
    });

    if (!grRes.ok) {
        throw new Error(`Groq API failed: ${grRes.statusText}`);
    }

    const data = await grRes.json() as any;
    const content = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    return { content, source: `Llama 3.1 Fallback (${options.groqModel})` };
}

// ─── Action: Chat ───
async function handleChat(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, request, 405);

    const body = await request.json() as { messages?: unknown[] };
    const { messages } = body;
    if (!messages || !Array.isArray(messages)) return jsonResponse({ error: 'Missing or invalid messages array' }, request, 400);

    try {
        const { content, source } = await executeAiRequest(messages, env, {
            deepseekModel: 'deepseek-v3.2',
            groqModel: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 500,
        });
        return jsonResponse({ success: true, content, source }, request);
    } catch (e: any) {
        return jsonResponse({ error: e.message || 'AI request failed' }, request, 500);
    }
}

// ─── Action: Chatbot Context ───
function buildKnowledgeBase(content: Record<string, any>): string {
    let kb = '';
    const hero = content.hero;
    if (hero) kb += `IDENTITY: ${hero.title}. "${hero.tagline}". ${hero.subtitle}\n`;

    const projects = content.projects?.items || [];
    if (projects.length > 0) {
        kb += 'PROJECTS (USE THESE EXACT LINKS ONLY):\n';
        projects.forEach((p: any, index: number) => {
            const projectId = p.id || index;
            const tags = (p.tags || []).join(', ');
            kb += `- ${p.title} (${tags}): ${SITE_BASE_URL}/project/${projectId}\n`;
        });
    }

    const services = content.services?.items || [];
    if (services.length > 0) kb += 'SERVICES: ' + services.map((s: any) => s.title).join(', ') + '\n';

    const ts = content.techStack;
    if (ts) {
        const items = ts.items || [];
        if (items.length > 0) kb += 'TECH: ' + items.map((t: any) => t.name || t).join(', ') + '\n';
    }

    const whyUs = content.whyUs?.items || [];
    if (whyUs.length > 0) kb += 'WHY US: ' + whyUs.map((w: any) => w.title).join(', ') + '\n';

    const leadership = content.leadership?.members || [];
    if (leadership.length > 0) kb += 'TEAM: ' + leadership.map((l: any) => `${l.name} (${l.role})`).join(', ') + '\n';

    const footer = content.footer;
    if (footer) {
        const activeSocials = (footer.socials || []).filter((s: any) => s.enabled && s.url);
        if (activeSocials.length > 0) kb += 'SOCIALS: ' + activeSocials.map((s: any) => `${s.platform}: ${s.url}`).join(', ') + '\n';
    }

    kb += `CORE LINKS: Home: ${SITE_BASE_URL} | Projects: ${SITE_BASE_URL}/project | Contact: ${SITE_BASE_URL}/#contact\n`;

    const linksData = content.links?.items || [];
    if (linksData.length > 0) kb += 'ADDITIONAL LINKS:\n' + linksData.map((l: any) => `- ${l.title}: ${l.link}`).join('\n') + '\n';

    return kb;
}

async function generateGist(knowledgeBase: string, env: Env): Promise<string | null> {
    try {
        const { content } = await executeAiRequest(
            [
                {
                    role: 'system',
                    content: 'You are a technical documentator. Summarize the following company knowledge base into a SHORT factual reference (~150 words max). CRITICAL: All URLs and proper names (Project Titles, Service Names) must be preserved EXACTLY as in the source. NEVER synthesize new categories like "PROJECT SHOWCASE" or "AI SERVICES". NEVER abbreviate or abbreviate URLs. If the source says "LifeSolver: https://site.com/project/1", keep it exactly like that. NO marketing fluff. Output ONLY the summary.'
                },
                { role: 'user', content: knowledgeBase }
            ], 
            env, 
            {
                deepseekModel: 'deepseek-v3.2',
                groqModel: 'llama-3.1-8b-instant',
                temperature: 0.2,
                max_tokens: 300,
            }
        );
        return content.trim() || null;
    } catch { return null; }
}

async function handleContext(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET') return jsonResponse({ error: 'Method not allowed' }, request, 405);

    const db = getDb(env);
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'en';
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    if (forceRefresh) {
        try { await db.execute({ sql: 'DELETE FROM kb_gist WHERE lang = ?', args: [lang] }); } catch { /* skip */ }
    }

    let content: Record<string, any> = {};

    // Try cache first
    try {
        const cacheResult = await db.execute({ sql: 'SELECT data FROM content_cache WHERE lang = ?', args: [lang] });
        if (cacheResult.rows.length > 0) content = JSON.parse(cacheResult.rows[0].data as string);
    } catch { /* skip */ }

    // Fallback
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
        const fullKB = buildKnowledgeBase(content);
        let leadInfo = '';
        try {
            const leadResult = await db.execute('SELECT COUNT(*) as count FROM leads');
            const count = Number(leadResult.rows[0]?.count ?? 0);
            if (count > 0) leadInfo = `\nLEAD STATS: ${count} total leads captured.\n`;
        } catch { /* skip */ }

        const fullKBWithLeads = fullKB + leadInfo;
        const gist = await generateGist(fullKBWithLeads, env);

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

    return jsonResponse(
        {
            success: true,
            knowledgeBase: sanitizedKB,
            qaPairs: qaPairs || null,
            systemPrompt: chatbot.systemPrompt || null,
            lang,
        },
        request,
        200,
        {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        }
    );
}

// ─── Action: Enhance ───
async function handleEnhance(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, request, 405);

    if (!(await isAuthorized(request, env.JWT_SECRET))) {
        return jsonResponse({ error: 'Unauthorized' }, request, 401);
    }

    const body = await request.json() as { text?: string; lang?: string };
    const { text, lang } = body;
    if (!text || !lang) return jsonResponse({ error: 'Missing text or lang' }, request, 400);
    const systemPrompt = lang === 'en'
        ? "You are a professional copywriter for ORBIT SaaS. Your goal is to refine and compact the user's input. Make it more professional, high-impact, and premium. Keep it extremely concise (compact). Use active voice. If the input contains HTML tags, PRESERVE them. Return ONLY the refined text, no preamble."
        : "আপনি ORBIT SaaS-এর একজন পেশাদার কপিরাইটার। আপনার লক্ষ্য হলো ইউজারের ইনপুটকে আরও মার্জিত, পেশাদার এবং প্রিমিয়াম করা। কথাগুলো খুব সংক্ষিপ্ত কিন্তু আকর্ষণীয় রাখুন। যদি ইনপুটে HTML ট্যাগ থাকে, সেগুলো পরিবর্তন করবেন ঘনবেন না। শুধুমাত্র সংশোধিত টেক্সটটি রিটার্ন করুন, অন্য কোনো কথা বলবেন না।";

    try {
        const { content, source } = await executeAiRequest(
            [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
            ],
            env,
            {
                deepseekModel: 'deepseek-v3.2',
                groqModel: 'llama-3.1-8b-instant',
                temperature: 0.5,
                max_tokens: 512,
            }
        );
        const enhancedText = content.trim() || text;
        return jsonResponse({ success: true, enhancedText, source }, request);
    } catch (e: any) {
        throw new Error(`AI API failed: ${e.message}`);
    }
}

// ─── Main Router ───
export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    if (request.method === 'OPTIONS') return handleOptions(request);

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || '';

    try {
        switch (action) {
            case 'chat': return await handleChat(request, env);
            case 'context': return await handleContext(request, env);
            case 'enhance': return await handleEnhance(request, env);
            default: return jsonResponse({ error: 'Unknown action. Use ?action=chat|context|enhance' }, request, 400);
        }
    } catch (error) {
        console.error('AI API error:', error);
        return jsonResponse({ error: 'Failed to process AI request' }, request, 500);
    }
};
