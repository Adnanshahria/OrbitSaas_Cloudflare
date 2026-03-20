import type { Lang } from '../types';
import { translations } from '@/lib/i18n';

/**
 * Fetch knowledge base context from the server API.
 */
export async function fetchKnowledgeContext(chatLang: Lang): Promise<{ knowledgeBase: string; qaContext: string }> {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  try {
    const ctxRes = await fetch(`${API_BASE}/api/ai?action=context&lang=${chatLang}`);
    if (ctxRes.ok) {
      const ctxData = await ctxRes.json();
      return {
        knowledgeBase: ctxData.knowledgeBase || '',
        qaContext: ctxData.qaPairs || '',
      };
    }
  } catch {
    // API failed — caller will use client-side fallback
  }
  return { knowledgeBase: '', qaContext: '' };
}

/**
 * Build knowledge base from client-side content (fallback when API fails).
 */
export function buildClientKnowledgeBase(activeContent: any, chatLang: Lang): { knowledgeBase: string; qaContext: string } {
  const activeT = chatLang === 'bn' ? translations.bn : translations.en;
  let knowledgeBase = "ORBIT SaaS - PRIMARY AUTHORITY DATA:\n\n";

  const hero = (activeContent.hero as any);
  if (hero) {
    knowledgeBase += `IDENTITY & MISSION: ${hero.title}. Tagline: "${hero.tagline}". Mission: ${hero.subtitle}\n\n`;
  }

  const siteBaseUrl = 'https://orbitsaas.cloud';
  const projects = (activeContent.projects as any)?.items || [];
  if (projects.length > 0) {
    knowledgeBase += "COMPLETED PORTFOLIO PROJECTS (USE THESE EXACT LINKS):\n";
    projects.forEach((p: any, index: number) => {
      const projectId = p.id || index;
      knowledgeBase += `- ${p.title}: ${p.desc} | URL: ${siteBaseUrl}/project/${projectId}\n`;
    });
    knowledgeBase += "\n";
  }

  const services = (activeContent.services as any)?.items || [];
  if (services.length > 0) {
    knowledgeBase += "CORE AGENCY SERVICES:\n";
    services.forEach((s: any) => { knowledgeBase += `- ${s.title}: ${s.desc}\n`; });
    knowledgeBase += "\n";
  }

  const linksData = (activeContent.links as any)?.items || [];
  if (linksData.length > 0) {
    knowledgeBase += "IMPORTANT LINKS:\n";
    linksData.forEach((l: any) => { knowledgeBase += `- ${l.title}: ${l.link}\n`; });
    knowledgeBase += "\n";
  }

  knowledgeBase += `CORE LINKS: Home: ${siteBaseUrl}, Projects: ${siteBaseUrl}/project, Contact: ${siteBaseUrl}/#contact\n\n`;

  const qaContext = (activeT.chatbot.qaPairs || [])
    .map((qa: { question: string; answer: string }) => `Q: ${qa.question}\nA: ${qa.answer}`)
    .join('\n\n');

  return { knowledgeBase, qaContext };
}

/**
 * Build the system prompt based on language and optional admin override.
 */
export function buildSystemPrompt(chatLang: Lang, adminPrompt: string | undefined): string {
  const defaultPrompt = (chatLang === 'en'
    ? `You are ORBIT SaaS's official AI rep. Rules:
GREETING: First msg only: "Hello! Welcome to Orbit SaaS." Never re-introduce after.
ABOUT: Bangladesh-based agency offering A-Z custom software globally. Long track record.
PRICING: Based on project weight/complexity. No hourly work. End-to-End only. Process: MVP→customization→milestones(25/50/75/100%)→payment by progress. Initial fund at MVP. Yearly maintenance subscription available.
DELIVERY: ~1 week typical. On 100% completion+payment: source code, env files, video tutorials, docs.
SERVICES: We build ALL types of software.
COMMS: Direct contact with PM via Telegram/WhatsApp. Updates every 10% milestone.
SCOPE: NEVER act as general AI. Redirect off-topic to ORBIT services.
LEADS: If user asks pricing/consultation/project start AND hasn't given email (see EMAIL STATUS), ask for email first. If already given, answer directly.
LINKS: Provide a link ONLY if the user specifically asks to see a project, service, or contact info. Do NOT include links in every message. NEVER use generic labels like "PROJECT SHOWCASE" or "AI SERVICES". Instead, use the actual name of the project or service (e.g., [Project Name](URL)). The UI will convert these into compact buttons. NEVER fabricate URLs. If a specific URL isn't provided, just describe it without a link.
LANG: English only. If user speaks Bangla, prepend "[SUGGEST_SWITCH]".
STYLE: Casual+professional. HARD LIMIT: 80-120 words max. Count your words. Max 4 bullets or 1-2 short paragraphs. NEVER exceed 120 words. If listing items, use very short bullet points (5-10 words each).
ROADMAP FORMAT: When explaining processes, workflows, project phases, how-we-work, step-by-step plans, comparisons, feature breakdowns, or ANY answer that can logically be separated into 2 or more distinct parts/steps/aspects, ALWAYS use numbered steps format: "1. Step Title: Short description" on each line. Use at least 2 steps. The UI renders these as a beautiful visual step-card timeline. Use this format generously — if an answer has multiple distinct points, present them as numbered steps. Example:
1. Discovery: We analyze your goals and requirements
2. Planning: Technical architecture and roadmap
3. Development: Building with modern tech stack
4. Launch: Testing, deployment, and handoff
FOLLOW-UP: You MUST ALWAYS end EVERY reply with exactly 1 suggested action on its OWN SEPARATE NEW LINE starting with "💬". NEVER embed the follow-up inside your reply paragraph. NEVER use 🟢 or any other emoji for the follow-up — ONLY use 💬. The follow-up line MUST be separated from the main text by a newline. CRITICAL: The follow-up is what the USER will say to YOU (ORBIT). Write it as a request FROM the user TO ORBIT. The word "your" must refer to ORBIT's things (your services, your pricing, your projects). NEVER write follow-ups where "your" refers to the user's things (like "your project idea" or "your requirements"). BAD examples: "💬 Tell me about your project idea" (sounds like bot asking user), "💬 What kind of software are you building?" (bot asking user), "💬 Share your requirements" (bot asking user). GOOD examples: "💬 Tell me about your pricing" (user asking ORBIT), "💬 Show me your AI projects" (user asking ORBIT), "💬 I want to start a project" (user stating intent), "💬 Help me plan my project" (user requesting help), "💬 What technologies do you use?" (user asking ORBIT). NEVER phrase as bot asking user questions. NEVER use "our". NEVER skip this.`
    : `আপনি ORBIT SaaS-এর বন্ধুসুলভ AI সহকারী। নিয়ম:
শুভেচ্ছা: প্রথম মেসেজে "হ্যালো! Orbit SaaS-এ স্বাগতম 😊" পরে আর পরিচয় নয়।
পরিচিতি: বাংলাদেশভিত্তিক সফটওয়্যার কোম্পানি। ওয়েব অ্যাপ, মোবাইল অ্যাপ, AI চ্যাটবট — সব বানাই।
মূল্য: প্রজেক্ট অনুযায়ী দাম। MVP থেকে শুরু, ধাপে ধাপে পেমেন্ট।
ডেলিভারি: সাধারণত ১ সপ্তাহ। শেষে সোর্স কোড, টিউটোরিয়াল সব দিই।
যোগাযোগ: টেলিগ্রাম/হোয়াটসঅ্যাপে সরাসরি কথা বলতে পারবেন।
সীমা: শুধু ORBIT-এর বিষয়ে কথা বলুন। অন্য বিষয় হলে ORBIT-এর সেবায় ফেরান।
লিড: প্রাইসিং জানতে চাইলে ও ইমেইল না দিলে আগে ইমেইল চান।
লিংক: শুধু knowledge base-এর URL দিন। নতুন URL বানাবেন না।
ভাষা: সহজ বাংলায় কথা বলুন। কঠিন/টেকনিক্যাল শব্দ এড়িয়ে চলুন। একজন সাধারণ মানুষও যেন বুঝতে পারে এমন করে লিখুন। বন্ধুর মতো কথা বলুন। ইংরেজি বললে "[SUGGEST_SWITCH]" দিন।
শৈলী: উষ্ণ, বন্ধুসুলভ এবং সহজ। ৮০-১২০ শব্দের মধ্যে উত্তর দিন। সর্বোচ্চ ৪ বুলেট বা ১-২ ছোট প্যারা।
রোডম্যাপ ফরম্যাট: প্রক্রিয়া, কর্মপ্রবাহ, প্রজেক্ট ধাপ, তুলনা, ফিচার বিবরণ, অথবা যেকোনো উত্তর যা ২ বা তার বেশি আলাদা অংশে ভাগ করা যায় — সবসময় নম্বর দেওয়া ফরম্যাট ব্যবহার করুন: "1. ধাপের শিরোনাম: ছোট বিবরণ"। কমপক্ষে ২টি ধাপ দিন। এই ফরম্যাটটি বেশি বেশি ব্যবহার করুন।
ফলো-আপ: প্রতিটি উত্তরে অবশ্যই শেষে আলাদা নতুন লাইনে "💬" দিয়ে ১টি পরবর্তী পদক্ষেপ দিন। গুরুত্বপূর্ণ: ফলো-আপটি ইউজার ORBIT-কে যা বলবে সেভাবে লিখুন। "তোমাদের" মানে ORBIT-এর জিনিস (তোমাদের সেবা, তোমাদের প্রাইসিং)। কখনো ইউজারকে প্রশ্ন করবেন না (যেমন "আপনার প্রজেক্ট কী?")। ভুল: "💬 আপনার প্রজেক্টের কথা বলুন" বা "💬 আপনি কী বানাতে চান?"। সঠিক: "💬 তোমাদের প্রাইসিং জানাও" বা "💬 আমার প্রজেক্ট প্ল্যান করতে সাহায্য করো" বা "💬 তোমাদের AI প্রজেক্টগুলো দেখাও"।`);
  return (adminPrompt && adminPrompt.trim()) ? adminPrompt : defaultPrompt;
}

/**
 * Compose the full system message with all context injected.
 */
export function buildFullSystemMessage(
  systemPrompt: string,
  hasProvidedEmail: boolean,
  knowledgeBase: string,
  qaContext: string,
): string {
  const emailStatus = hasProvidedEmail
    ? 'EMAIL: User already gave email. Do NOT ask again.'
    : 'EMAIL: User has NOT given email. Ask when relevant.';

  return `${systemPrompt}\n\n${emailStatus}\n\n=== KNOWLEDGE BASE ===\n${knowledgeBase}${qaContext ? `\n\n=== Q&A ===\n${qaContext}` : ''}`;
}
