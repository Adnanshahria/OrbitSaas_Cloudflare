import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { MessageCircle, X, Send, Loader2, Trash2, MoreVertical, ChevronDown, Mail, Bot } from 'lucide-react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useLang } from '@/contexts/LanguageContext';
import { useContent } from '@/contexts/ContentContext';
import { sendToGroq, ChatMessage } from '@/services/aiService';
import { translations } from '@/lib/i18n';

type Lang = 'en' | 'bn'; // Define Lang type

// User behavior modes for dynamic message selection
type UserMode = 'browsing' | 'reading' | 'deep-idle' | 'returning' | 'exploring' | 'casual';

// Idle escalation levels: casual (3s) -> engaging (10s) -> action (30s)
type EscalationLevel = 'casual' | 'engaging' | 'action';

// Context-aware dynamic messages with mode tags for behavior-aware selection
const contextMessages: Record<string, Array<{ en: string; bn: string; mode?: string }>> = {
  hero: [
    { en: 'Chat with ORBIT!', bn: 'ORBIT-এর সাথে চ্যাট করুন!' },
    { en: 'Ready to launch your project?', bn: 'প্রজেক্ট শুরু করতে প্রস্তুত?' },
    { en: 'Need a custom AI solution?', bn: 'কাস্টম এআই সলিউশন লাগবে?' },
    { en: 'Let’s transform your ideas into reality!', bn: 'আপনার আইডিয়াগুলোকে বাস্তবে রূপ দিই চলুন!' },
    { en: 'Looking for a reliable tech partner?', bn: 'নির্ভরযোগ্য টেক পার্টনার খুঁজছেন?' },
    { en: 'Hey! Got a project in mind? 🚀', bn: 'হেই! কোনো প্রজেক্ট মাথায় আছে? 🚀' },
    { en: 'Your next big idea starts here ✨', bn: 'আপনার পরবর্তী বড় আইডিয়া এখান থেকেই শুরু ✨' },
    { en: 'I can help you get started fast!', bn: 'আমি আপনাকে দ্রুত শুরু করতে সাহায্য করতে পারি!' },
    { en: 'Thinking about going digital?', bn: 'ডিজিটাল হওয়ার কথা ভাবছেন?' },
    { en: '3 clients launched this week! You next?', bn: 'এই সপ্তাহে ৩টি ক্লায়েন্ট লঞ্চ! আপনি পরবর্তী?' },
    { en: 'I know the perfect solution for you 😊', bn: 'আমি আপনার জন্য পারফেক্ট সলিউশন জানি 😊' },
  ],
  services: [
    { en: 'Need help choosing a service?', bn: 'সঠিক সেবা খুঁজতে সাহায্য লাগবে?' },
    { en: 'Want to know more about our services?', bn: 'আমাদের সার্ভিস নিয়ে আরও জানতে চান?' },
    { en: 'We build Web, AI, and Mobile Apps.', bn: 'আমরা ওয়েব, এআই এবং মোবাইল অ্যাপ বানাই।' },
    { en: 'Looking for End-to-End Development?', bn: 'এন্ড-টু-এন্ড ডেভেলপমেন্ট খুঁজছেন?' },
    { en: 'Ask me about our tech expertise!', bn: 'আমাদের টেক এক্সপার্টিজ সম্পর্কে জিজ্ঞেস করুন!' },
    { en: 'Which service caught your eye? 👀', bn: 'কোন সেবাটি আপনার চোখে পড়েছে? 👀' },
    { en: 'AI chatbots are trending! Want one?', bn: 'AI চ্যাটবট এখন ট্রেন্ডিং! একটা চান?' },
    { en: 'We handle everything from A to Z 💪', bn: 'আমরা A থেকে Z সব হ্যান্ডেল করি 💪' },
    { en: 'Confused which service fits you best?', bn: 'কোন সেবাটি আপনার জন্য সেরা?' },
    { en: 'Custom software, tailored for you 🎯', bn: 'আপনার জন্য কাস্টম সফটওয়্যার 🎯' },
  ],
  project: [
    { en: "Like our previous work?", bn: 'আমাদের কাজগুলো ভালো লেগেছে?' },
    { en: "Let's build something like this for you.", bn: 'আপনার জন্যও এমন কিছু বানাতে পারি।' },
    { en: 'Want a completely custom solution?', bn: 'আপনার জন্য সম্পূর্ণ কাস্টম সলিউশন চাই?' },
    { en: 'Check out the details of these projects.', bn: 'এই প্রজেক্টগুলোর বিস্তারিত দেখতে পারেন।' },
    { en: 'Tell me your project requirements!', bn: 'আপনার প্রজেক্টের রিকোয়ারমেন্টগুলো জানান!' },
    { en: 'This could be YOUR project next! 🔥', bn: 'এটা আপনার পরবর্তী প্রজেক্ট! 🔥' },
    { en: 'Impressed? Let me show you more!', bn: 'মুগ্ধ হয়েছেন? আরও দেখাতে পারি!' },
    { en: 'We built this in just 2 weeks! ⚡', bn: 'আমরা এটা মাত্র ২ সপ্তাহে বানিয়েছি! ⚡' },
    { en: 'Imagine your brand here!', bn: 'এখানে আপনার ব্র্যান্ড কল্পনা করুন!' },
    { en: 'Real projects. Real results. Ask me!', bn: 'আসল প্রজেক্ট। আসল ফলাফল। জিজ্ঞেস করুন!' },
  ],
  'tech-stack': [
    { en: 'Curious about our technologies?', bn: 'আমাদের প্রযুক্তি সম্পর্কে জানতে চান?' },
    { en: 'Need a specific tech stack?', bn: 'কোনো নির্দিষ্ট প্রযুক্তির কাজ খুঁজছেন?' },
    { en: 'We use modern, scalable tech.', bn: 'আমরা আধুনিক এবং স্কেলেবল প্রযুক্তি ব্যবহার করি।' },
    { en: 'Ask me about any specific tool.', bn: 'কোনো নির্দিষ্ট টুল সম্পর্কে জিজ্ঞেস করতে পারেন।' },
    { en: 'React, Next.js, AI - we do it all!', bn: 'React, Next.js, AI - সব করি!' },
    { en: 'Tech choices matter. Let me guide you!', bn: 'প্রযুক্তি নির্বাচন গুরুত্বপূর্ণ। আমি গাইড করি!' },
    { en: 'We pick the right stack for YOUR needs', bn: 'আপনার প্রয়োজন অনুযায়ী সেরা স্ট্যাক বাছাই করি' },
    { en: 'Wondering which tech is best for you?', bn: 'কোন প্রযুক্তি আপনার জন্য সেরা ভাবছেন?' },
  ],
  'why-us': [
    { en: 'Want to know why clients choose us?', bn: 'ক্লায়েন্টরা কেন আমাদের ভালোবাসে?' },
    { en: 'We guarantee 100% satisfaction.', bn: 'আমরা ১০০% গ্যারান্টি দিয়ে কাজ করি।' },
    { en: 'Ask about our communication process.', bn: 'আমাদের কমিউনিকেশন প্রসেস সম্পর্কে জানুন।' },
    { en: 'We deliver on time, every time.', bn: 'আমরা সবসময় ঠিক সময়ে কাজ ডেলিভারি দিই।' },
    { en: 'Still deciding? Let me convince you!', bn: 'এখনও ভাবছেন? আমি কনভিন্স করি!' },
    { en: 'Our clients keep coming back!', bn: 'আমাদের ক্লায়েন্টরা বারবার ফিরে আসে!' },
    { en: 'Direct communication - no middlemen!', bn: 'সরাসরি যোগাযোগ - কোনো মধ্যস্থতাকারী নেই!' },
    { en: 'Milestone-based payments. Zero risk!', bn: 'মাইলস্টোন-ভিত্তিক পেমেন্ট। শূন্য ঝুঁকি!' },
  ],
  leadership: [
    { en: 'Want to talk to our leadership team?', bn: 'আমাদের লিডারশিপ টিমের সাথে কথা বলবেন?' },
    { en: 'Any questions for our founders?', bn: 'আমাদের ফাউন্ডারদের জন্য কোনো প্রশ্ন আছে?' },
  ],
  contact: [
    { en: 'Have a specific question?', bn: 'কোনো নির্দিষ্ট প্রশ্ন আছে?' },
    { en: 'Drop me a message here!', bn: 'এখানে আমাকে ম্যাসেজ দিন!' },
    { en: 'Want to book a free consultation?', bn: 'ফ্রি কনসাল্টেশন বুক করতে চান?' },
    { en: 'I can connect you to our team.', bn: 'আমি আপনাকে আমাদের টিমের সাথে কানেক্ট করতে পারি।' },
    { en: 'Ready to start? Let me help!', bn: 'শুরু করতে প্রস্তুত? আমি সাহায্য করি!' },
    { en: 'One message away from your dream app!', bn: 'আপনার স্বপ্নের অ্যাপ থেকে মাত্র এক মেসেজ দূরে!' },
    { en: 'I respond faster than email!', bn: 'আমি ইমেইলের চেয়ে দ্রুত উত্তর দিই!' },
    { en: 'No commitment - just a friendly chat', bn: 'কোনো বাধ্যবাধকতা নেই - শুধু বন্ধুত্বপূর্ণ আলাপ' },
  ],
  default: [
    { en: 'Chat with ORBIT', bn: 'ORBIT-এর সাথে চ্যাট করুন' },
    { en: 'How can I help you today?', bn: 'কীভাবে সাহায্য করতে পারি?' },
    { en: 'Still here if you need me!', bn: 'আমি এখানেই আছি, কোনো সাহায্য লাগলে বলবেন!' },
    { en: 'Have any questions?', bn: 'আপনার কোনো প্রশ্ন আছে?' },
    { en: 'Let’s discuss your project.', bn: 'চলুন আপনার প্রজেক্ট নিয়ে আলোচনা করি।' },
    { en: 'Need a quick estimate?', bn: 'দ্রুত প্রজেক্টের খরচ জানতে চান?' },
    { en: 'I noticed you are browsing around!', bn: 'দেখলাম আপনি ঘুরে দেখছেন!' },
    { en: 'Got 30 seconds? Let me surprise you!', bn: '৩০ সেকেন্ড আছে? আমি চমকে দিই!' },
    { en: 'Fun fact: I never sleep!', bn: 'মজার তথ্য: আমি কখনো ঘুমাই না!' },
    { en: 'Your competitors are already building!', bn: 'আপনার প্রতিযোগীরা ইতিমধ্যে তৈরি করছে!' },
    { en: 'Tap me for instant answers!', bn: 'তাৎক্ষণিক উত্তরের জন্য আমাকে ট্যাপ করুন!' },
    { en: 'I can help you save time and money!', bn: 'আমি আপনার সময় ও টাকা বাঁচাতে পারি!' },
  ],
  reviews: [
    { en: 'See what our clients say about us!', bn: 'আমাদের ক্লায়েন্টরা কী বলে দেখুন!', mode: 'casual' },
    { en: 'Real reviews from real clients.', bn: 'আসল ক্লায়েন্টদের আসল রিভিউ।', mode: 'casual' },
    { en: 'These reviews speak for themselves!', bn: 'এই রিভিউগুলো নিজেই কথা বলে!', mode: 'casual' },
    { en: 'Hundreds of happy clients worldwide', bn: 'বিশ্বজুড়ে শত শত খুশি ক্লায়েন্ট', mode: 'engaging' },
    { en: 'Your success story could be next!', bn: 'আপনার সাফল্যের গল্প পরবর্তী হতে পারে!', mode: 'engaging' },
    { en: 'Join 100+ satisfied businesses!', bn: '১০০+ সন্তুষ্ট ব্যবসায়ে যোগ দিন!', mode: 'action' },
    { en: '5-star rated by every client! Ask me why', bn: 'প্রতিটি ক্লায়েন্ট ৫-স্টার দিয়েছে! জিজ্ঞেস করুন কেন', mode: 'action' },
  ],
  returning: [
    { en: 'Welcome back! Missed you!', bn: 'ফিরে এসেছেন! আপনাকে মিস করেছি!', mode: 'returning' },
    { en: 'Hey, you are back! Need anything?', bn: 'হেই, ফিরে এসেছেন! কিছু লাগবে?', mode: 'returning' },
    { en: 'Good to see you again!', bn: 'আবার দেখে ভালো লাগলো!', mode: 'returning' },
    { en: 'Still thinking? Let me help decide!', bn: 'এখনো ভাবছেন? সিদ্ধান্ত নিতে সাহায্য করি!', mode: 'returning' },
    { en: 'Back for more? I am here for you!', bn: 'আরো জানতে ফিরে এসেছেন? আমি এখানেই আছি!', mode: 'returning' },
    { en: 'Picked up where you left off?', bn: 'যেখানে ছেড়েছিলেন সেখান থেকে শুরু করবেন?', mode: 'returning' },
  ]
};

export function Chatbot() {
  const { t, lang: siteLang, toggleLang } = useLang();
  const { content } = useContent(); // Access dynamic content
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatLang, setChatLang] = useState<Lang>('en'); // Independent chat language
  const [viewportStyle, setViewportStyle] = useState<React.CSSProperties>({});
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ en: 'Chat with ORBIT', bn: 'ORBIT-এর সাথে চ্যাট করুন' });
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track shown messages to never repeat until all exhausted
  const shownMessages = useRef<Set<string>>(new Set());
  const summarySentRef = useRef(false);

  // --- Behavior mode detection refs ---
  const scrollCountRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const sectionHistoryRef = useRef<Set<string>>(new Set());
  const tabWasHiddenRef = useRef(false);
  const idleLevelRef = useRef<EscalationLevel>('casual');
  const escalationTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Typing animation state
  const [typingText, setTypingText] = useState('');
  const [isTypingAnim, setIsTypingAnim] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Helper to determine the section currently in view
  const getActiveSection = () => {
    const sections = ['hero', 'services', 'tech-stack', 'why-us', 'project', 'reviews', 'leadership', 'contact'];
    let currentSection = 'default';
    let maxVisibleHeight = 0;

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Calculate how much of the element is visible in the viewport
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        if (visibleHeight > maxVisibleHeight && visibleHeight > window.innerHeight * 0.2) {
          maxVisibleHeight = visibleHeight;
          currentSection = id;
        }
      }
    });
    return currentSection;
  };

  // Detect current user behavior mode
  const detectUserMode = (): UserMode => {
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;
    if (tabWasHiddenRef.current) { tabWasHiddenRef.current = false; return 'returning'; }
    if (sectionHistoryRef.current.size >= 3) return 'exploring';
    if (scrollCountRef.current > 5 && timeSinceLastScroll < 8000) return 'browsing';
    if (timeSinceLastScroll < 15000 && scrollCountRef.current > 1) return 'reading';
    if (timeSinceLastScroll > 20000) return 'deep-idle';
    return 'casual';
  };

  // Select a mode-aware message, never repeating until all exhausted
  const getRandomContextMessage = (sectionId: string, escalation?: EscalationLevel) => {
    const userMode = detectUserMode();
    const level = escalation || idleLevelRef.current;

    // For returning users, prefer returning messages first
    if (userMode === 'returning') {
      const returnMsgs = contextMessages['returning'] || [];
      const unusedReturn = returnMsgs.filter(m => !shownMessages.current.has(m.en));
      if (unusedReturn.length > 0) {
        const pick = unusedReturn[Math.floor(Math.random() * unusedReturn.length)];
        shownMessages.current.add(pick.en);
        return pick;
      }
    }

    const allMsgs = contextMessages[sectionId] || contextMessages['default'];
    const levelMsgs = allMsgs.filter(m => m.mode === level);
    const pool = levelMsgs.length > 0 ? levelMsgs : allMsgs;

    const unused = pool.filter(m => !shownMessages.current.has(m.en));
    if (unused.length === 0) {
      // All shown — reset and pick fresh
      pool.forEach(m => shownMessages.current.delete(m.en));
      const fresh = pool.filter(m => m.en !== popupMessage.en);
      const pick = fresh.length > 0 ? fresh[Math.floor(Math.random() * fresh.length)] : pool[0];
      shownMessages.current.add(pick.en);
      return pick;
    }
    const pick = unused[Math.floor(Math.random() * unused.length)];
    shownMessages.current.add(pick.en);
    return pick;
  };

  // Listen to external interactions to temporarily hide the popup
  useEffect(() => {
    const handleRemoteDismiss = () => setShowWelcomePopup(false);
    window.addEventListener('orbit-cta-open', handleRemoteDismiss);
    return () => window.removeEventListener('orbit-cta-open', handleRemoteDismiss);
  }, []);

  // Hide the welcome popup during comet collisions, then let it reappear naturally
  useEffect(() => {
    const handleCollisionStart = () => setShowWelcomePopup(false);
    window.addEventListener('orbit-collision-start', handleCollisionStart);
    window.addEventListener('orbit-collision-end', handleCollisionStart); // keep hidden, idle timer will bring it back
    return () => {
      window.removeEventListener('orbit-collision-start', handleCollisionStart);
      window.removeEventListener('orbit-collision-end', handleCollisionStart);
    };
  }, []);

  // Tab visibility tracking for returning-user detection
  useEffect(() => {
    const handleVisibility = () => { if (document.hidden) tabWasHiddenRef.current = true; };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Scroll tracking for behavior mode detection
  useEffect(() => {
    const handleScroll = () => {
      scrollCountRef.current++;
      lastScrollTimeRef.current = Date.now();
      const sec = getActiveSection();
      if (sec !== 'default') sectionHistoryRef.current.add(sec);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation — character-by-character reveal (30ms per char)
  const startTypingAnimation = useCallback((text: string) => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setIsTypingAnim(true);
    setTypingText('');
    let ci = 0;
    const typeChar = () => {
      if (ci < text.length) {
        setTypingText(text.slice(0, ci + 1));
        ci++;
        typingTimerRef.current = setTimeout(typeChar, 30);
      } else {
        setIsTypingAnim(false);
      }
    };
    typingTimerRef.current = setTimeout(typeChar, 30);
  }, []);

  // Progressive escalation: casual(3s) → engaging(10s) → action(30s)
  useEffect(() => {
    if (!showWelcomePopup || open) return;

    const engagingTimer = setTimeout(() => {
      idleLevelRef.current = 'engaging';
      const activeSec = getActiveSection();
      const msg = getRandomContextMessage(activeSec, 'engaging');
      setPopupMessage(msg);
      startTypingAnimation(chatLang === 'bn' ? msg.bn : msg.en);
    }, 10000);

    const actionTimer = setTimeout(() => {
      idleLevelRef.current = 'action';
      const activeSec = getActiveSection();
      const msg = getRandomContextMessage(activeSec, 'action');
      setPopupMessage(msg);
      startTypingAnimation(chatLang === 'bn' ? msg.bn : msg.en);
    }, 30000);

    // Continue cycling every 8s
    cycleTimer.current = setInterval(() => {
      const activeSec = getActiveSection();
      const msg = getRandomContextMessage(activeSec);
      setPopupMessage(msg);
      startTypingAnimation(chatLang === 'bn' ? msg.bn : msg.en);
    }, 8000);

    escalationTimers.current = [engagingTimer, actionTimer];

    return () => {
      clearTimeout(engagingTimer);
      clearTimeout(actionTimer);
      if (cycleTimer.current) clearInterval(cycleTimer.current as unknown as number);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [showWelcomePopup, open, chatLang]);

  // Idle tracking — hide instantly on ANY activity, re-appear after 3s idle
  useEffect(() => {
    if (open || messages.length > 0) {
      setShowWelcomePopup(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      return;
    }

    const showPopup = () => {
      if (!open && messages.length === 0) {
        idleLevelRef.current = 'casual';
        const activeSec = getActiveSection();
        const msg = getRandomContextMessage(activeSec, 'casual');
        setPopupMessage(msg);
        setShowWelcomePopup(true);
        startTypingAnimation(chatLang === 'bn' ? msg.bn : msg.en);
      }
    };

    const hideAndResetIdle = () => {
      setShowWelcomePopup(false);
      setIsTypingAnim(false);
      setTypingText('');
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      idleLevelRef.current = 'casual';
      escalationTimers.current.forEach(t => clearTimeout(t));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(showPopup, 3000);
    };

    const events = ['mousemove', 'scroll', 'keydown', 'mousedown', 'touchstart', 'touchmove', 'click'];
    events.forEach(evt => window.addEventListener(evt, hideAndResetIdle, { passive: true }));
    idleTimer.current = setTimeout(showPopup, 3000);

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      escalationTimers.current.forEach(t => clearTimeout(t));
      events.forEach(evt => window.removeEventListener(evt, hideAndResetIdle));
    };
  }, [open, messages.length, chatLang]);


  // Dynamic chatbot strings with fallbacks to static translations (memoized)
  const chatContentMemo = useMemo(() => ({
    title: (content[chatLang] as any)?.chatbot?.title || translations[chatLang].chatbot.title,
    placeholder: (content[chatLang] as any)?.chatbot?.placeholder || translations[chatLang].chatbot.placeholder,
    greeting: (content[chatLang] as any)?.chatbot?.greeting || translations[chatLang].chatbot.greeting,
    systemPrompt: (content[chatLang] as any)?.chatbot?.systemPrompt || '',
  }), [content, chatLang]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.chatbot-menu-container')) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const scrollYRef = useRef(0);
  // Ref to track latest messages for use in close handler without adding to deps
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  useEffect(() => {
    // Notify other components about chatbot state
    window.dispatchEvent(new CustomEvent('orbit-chatbot-state-change', { detail: { isOpen: open } }));

    // Send chat summary when chatbot is closed (for returning users who already gave email)
    if (!open && hasProvidedEmail && messagesRef.current.length > 0) {
      sendChatSummary(messagesRef.current);
    }

    const isMobile = window.innerWidth < 768;

    // Block touchmove on background when chatbot is open on mobile
    const preventScroll = (e: TouchEvent) => {
      // Allow scrolling inside the chatbot panel itself
      const target = e.target as HTMLElement;
      if (target.closest('.chatbot-messages-area') || target.closest('.chatbot-input-area')) return;
      e.preventDefault();
    };

    if (open && isMobile) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;
      // Fully lock the body to prevent any content shifting
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      // Also lock the html element
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.documentElement.style.touchAction = 'none';
      // Block touchmove on document as a bulletproof fallback
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      // Restore body position and scroll
      const savedY = scrollYRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.touchAction = '';
      if (savedY) {
        window.scrollTo(0, savedY);
      }
    }
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      const savedY = scrollYRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.touchAction = '';
      if (savedY) {
        window.scrollTo(0, savedY);
      }
    };
  }, [open]);

  // Add state to track if email has been provided
  const [hasProvidedEmail, setHasProvidedEmail] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'loading'>('idle');
  // Ref to hold pending messages while waiting for email submission
  const pendingMessagesRef = useRef<ChatMessage[] | null>(null);

  // Load email status on mount
  useEffect(() => {
    const status = localStorage.getItem('orbit_chatbot_email_provided');
    if (status === 'true') {
      setHasProvidedEmail(true);
    }
  }, []);

  // --- Reusable function to generate AI summary and send to leads API ---
  const sendChatSummary = useCallback(async (currentMessages: ChatMessage[], sync = false) => {
    if (summarySentRef.current) return;

    const userMsgs = currentMessages.filter(m => m.role === 'user');
    const assistantMsgs = currentMessages.filter(m => m.role === 'assistant');
    if (userMsgs.length < 1 || assistantMsgs.length < 1) return;

    const storedEmail = leadEmail || localStorage.getItem('orbit_chatbot_email') || '';
    if (!storedEmail) return;

    summarySentRef.current = true;

    // For sync (beacon) calls, send raw chat without AI summary
    if (sync) {
      const rawChat = currentMessages
        .filter(m => m.role !== 'system')
        .map(m => `${m.role === 'user' ? 'User' : 'Orbit AI'}: ${m.content}`)
        .join('\n');
      const API_BASE = import.meta.env.VITE_API_URL || '';
      try {
        navigator.sendBeacon(
          `${API_BASE}/api/leads?action=submit`,
          new Blob([JSON.stringify({
            email: storedEmail,
            source: 'Chatbot Gateway',
            interest: userMsgs[userMsgs.length - 1]?.content || 'General Inquiry',
            chat_summary: `[Raw Chat - ${new Date().toLocaleString()}]\n${rawChat}`
          })], { type: 'application/json' })
        );
      } catch { /* fail silently */ }
      return;
    }

    try {
      const rawChat = currentMessages
        .filter(m => m.role !== 'system')
        .map(m => `${m.role === 'user' ? 'User' : 'Orbit AI'}: ${m.content}`)
        .join('\n');

      const summaryPrompt: ChatMessage[] = [
        {
          role: 'system',
          content: `You are a chat summarizer. Given a conversation between a user and Orbit SaaS AI, produce a compact 2-4 sentence summary. Include: what the user asked about, what services/projects interested them, and any action items. Be concise and factual. Do NOT use markdown. Output ONLY the summary text.`
        },
        { role: 'user', content: rawChat }
      ];

      const aiSummary = await sendToGroq(summaryPrompt);

      const API_BASE = import.meta.env.VITE_API_URL || '';
      await fetch(`${API_BASE}/api/leads?action=submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: storedEmail,
          source: 'Chatbot Gateway',
          interest: userMsgs[userMsgs.length - 1]?.content || 'General Inquiry',
          chat_summary: `[AI Summary] ${aiSummary}`
        })
      });
    } catch {
      // Fail silently — this is a background enhancement
    }
  }, [leadEmail]);

  // --- INACTIVITY SUMMARY: After 45s of no new messages, generate AI summary and update lead ---
  useEffect(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    const userMsgs = messages.filter(m => m.role === 'user');
    const assistantMsgs = messages.filter(m => m.role === 'assistant');
    if (!hasProvidedEmail || userMsgs.length < 1 || assistantMsgs.length < 1) return;

    inactivityTimer.current = setTimeout(() => {
      sendChatSummary(messages);
    }, 45000);

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [messages, hasProvidedEmail, sendChatSummary]);

  // --- SUMMARY ON PAGE LEAVE / TAB SWITCH: Catch returning users who leave without waiting 45s ---
  useEffect(() => {
    if (!hasProvidedEmail) return;

    const handleBeforeUnload = () => {
      const userMsgs = messages.filter(m => m.role === 'user');
      const assistantMsgs = messages.filter(m => m.role === 'assistant');
      if (userMsgs.length < 1 || assistantMsgs.length < 1 || summarySentRef.current) return;
      // Use sync sendBeacon for page unload (async fetch won't complete)
      sendChatSummary(messages, true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden && messages.filter(m => m.role === 'user').length >= 1) {
        sendChatSummary(messages, true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [messages, hasProvidedEmail, sendChatSummary]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadEmail.includes('@')) {
      toast.error(chatLang === 'bn' ? 'দয়া করে সঠিক ইমেইল দিন' : 'Please enter a valid email');
      return;
    }

    setLeadStatus('loading');
    try {
      // Format chat summary to include in the lead
      const chatSummary = messages
        .map(m => `${m.role === 'user' ? 'User' : 'Orbit AI'}: ${m.content}`)
        .join('\n\n');

      // Extract user interest from their messages
      const userMessages = messages.filter(m => m.role === 'user');
      const extractedInterest = userMessages.length > 0
        ? userMessages[userMessages.length - 1].content
        : 'General Inquiry';

      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/leads?action=submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail,
          source: 'Chatbot Gateway',
          interest: extractedInterest,
          chat_summary: chatSummary
        })
      });

      if (res.ok) {
        localStorage.setItem('orbit_chatbot_email_provided', 'true');
        localStorage.setItem('orbit_chatbot_email', leadEmail);
        setHasProvidedEmail(true);
        setShowEmailPrompt(false);
        summarySentRef.current = false; // Allow summary to fire for this session
        toast.success(chatLang === 'bn' ? 'ধন্যবাদ! এখন আপনি চ্যাট শুরু করতে পারেন।' : 'Thank you! You can now start chatting.');

        // Now trigger the AI response for the pending messages
        const pending = pendingMessagesRef.current || messages;
        pendingMessagesRef.current = null;
        setIsLoading(true);
        executeAIResponse(pending);
      } else {
        throw new Error('Failed');
      }
    } catch {
      toast.error(chatLang === 'bn' ? 'কিছু ভুল হয়েছে, আবার চেষ্টা করুন' : 'Something went wrong, please try again');
    } finally {
      setLeadStatus('idle');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let resizeTimer: ReturnType<typeof setTimeout>;

    const updateViewport = () => {
      if (window.visualViewport) {
        const isKbOpen = window.visualViewport.height < window.innerHeight * 0.75;
        setIsKeyboardOpen(isKbOpen);

        if (window.innerWidth < 768) {
          if (isKbOpen) {
            // Keyboard is open: use exact visual viewport height, pin to top
            const vvHeight = window.visualViewport.height;
            setViewportStyle({
              height: `${vvHeight}px`,
              top: '0px',
              bottom: 'auto',
              transition: 'height 0.25s cubic-bezier(0.32, 0.72, 0, 1)'
            });
          } else {
            // Keyboard closed: clear inline styles, let CSS h-[100dvh] handle it
            setViewportStyle({});
          }

          // Always prevent scroll when chatbot is open on mobile
          if (open) {
            window.scrollTo(0, 0);
          }
        } else {
          // Desktop: use actual visible height minus bottom padding (toggle button area ~100px)
          const availableHeight = window.visualViewport.height - 100;
          const maxH = Math.min(availableHeight, window.innerHeight * 0.85);
          setViewportStyle({
            maxHeight: `${maxH}px`,
          });
        }
      }
    };

    const debouncedUpdateViewport = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateViewport, 100); // Debounce by 100ms
    };

    updateViewport();
    window.visualViewport?.addEventListener('resize', debouncedUpdateViewport);
    window.visualViewport?.addEventListener('scroll', debouncedUpdateViewport);
    window.addEventListener('resize', debouncedUpdateViewport);

    return () => {
      clearTimeout(resizeTimer);
      window.visualViewport?.removeEventListener('resize', debouncedUpdateViewport);
      window.visualViewport?.removeEventListener('scroll', debouncedUpdateViewport);
      window.removeEventListener('resize', debouncedUpdateViewport);
    };
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const clearChat = () => {
    setMessages([]);
    setSuggestions([]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setSuggestions([]);

    // --- EMAIL INTERCEPTOR ---
    // If the user types an email, capture it silently in the background
    const emailMatch = input.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) {
      try {
        // Find the user's previous context/interest
        const userMessagesOnly = messages.filter(m => m.role === 'user');
        const extractedInterest = userMessagesOnly.length > 0
          ? userMessagesOnly[userMessagesOnly.length - 1].content
          : 'General Inquiry';

        const chatSummary = messages
          .map(m => `${m.role === 'user' ? 'User' : 'Orbit AI'}: ${m.content}`)
          .join('\n\n');

        const API_BASE = import.meta.env.VITE_API_URL || '';
        fetch(`${API_BASE}/api/leads?action=submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailMatch[0],
            source: 'AI Chatbot Intercept',
            interest: extractedInterest,
            chat_summary: chatSummary
          })
        }).catch(() => { });
        localStorage.setItem('orbit_chatbot_email_provided', 'true');
        localStorage.setItem('orbit_chatbot_email', emailMatch[0]);
        setHasProvidedEmail(true);
        summarySentRef.current = false; // Allow summary to fire
      } catch (e) {
        // Fail silently so chat UX is not interrupted
      }
    }

    // --- EMAIL GATE: On 2nd question, show email form BEFORE AI reply ---
    const userMsgCount = newMessages.filter(m => m.role === 'user').length;
    const emailAlreadyProvided = hasProvidedEmail || !!emailMatch;
    if (userMsgCount >= 2 && !emailAlreadyProvided) {
      // Store messages and show email form — don't call AI yet
      pendingMessagesRef.current = newMessages;
      setShowEmailPrompt(true);
      return; // Block AI response until email is submitted
    }

    setIsLoading(true);
    await executeAIResponse(newMessages);
  };

  const executeAIResponse = async (chatHistory: ChatMessage[]) => {
    setIsLoading(true);
    try {
      // 1. Fetch knowledge base from server (reads directly from database)
      const activeT = chatLang === 'bn' ? translations.bn : translations.en;
      const chatContent = activeT.chatbot;
      let knowledgeBase = '';
      let qaContext = '';

      const API_BASE = import.meta.env.VITE_API_URL || '';
      try {
        const ctxRes = await fetch(`${API_BASE}/api/ai?action=context&lang=${chatLang}`);
        if (ctxRes.ok) {
          const ctxData = await ctxRes.json();
          knowledgeBase = ctxData.knowledgeBase || '';
          qaContext = ctxData.qaPairs || '';
        }
      } catch {
        // API failed — fall back to client-side assembly below
      }

      // Fallback: build from client-side content if API didn't return data
      if (!knowledgeBase) {
        const activeContent = content[chatLang] || content['en'];
        knowledgeBase = "ORBIT SaaS - PRIMARY AUTHORITY DATA:\n\n";

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

        qaContext = (activeT.chatbot.qaPairs || [])
          .map((qa: { question: string; answer: string }) => `Q: ${qa.question}\nA: ${qa.answer}`)
          .join('\n\n');
      }

      // 2. Prepare System Prompt based on chatLang
      const adminPrompt = (chatContent as any)?.systemPrompt;
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
ফলো-আপ: প্রতিটি উত্তরে অবশ্যই শেষে আলাদা নতুন লাইনে "💬" দিয়ে ১টি পরবর্তী পদক্ষেপ দিন। গুরুত্বপূর্ণ: ফলো-আপটি ইউজার ORBIT-কে যা বলবে সেভাবে লিখুন। "তোমাদের" মানে ORBIT-এর জিনিস (তোমাদের সেবা, তোমাদের প্রাইসিং)। কখনো ইউজারকে প্রশ্ন করবেন না (যেমন "আপনার প্রজেক্ট কী?")। ভুল: "💬 আপনার প্রজেক্টের কথা বলুন" বা "💬 আপনি কী বানাতে চান?"। সঠিক: "💬 তোমাদের প্রাইসিং জানাও" বা "💬 আমার প্রজেক্ট প্ল্যান করতে সাহায্য করো" বা "💬 তোমাদের AI প্রজেক্টগুলো দেখাও"।`);
      const systemPrompt = (adminPrompt && adminPrompt.trim()) ? adminPrompt : defaultPrompt;

      // 3. Email status context
      const emailStatus = hasProvidedEmail
        ? 'EMAIL: User already gave email. Do NOT ask again.'
        : 'EMAIL: User has NOT given email. Ask when relevant.';

      // 4. Combine everything (compact — server already sends AI gist)
      const fullSystemMessage = `${systemPrompt}\n\n${emailStatus}\n\n=== KNOWLEDGE BASE ===\n${knowledgeBase}${qaContext ? `\n\n=== Q&A ===\n${qaContext}` : ''}`;

      // 6. Cap conversation history to last 8 messages to limit token growth
      const recentHistory = chatHistory.filter(m => m.role !== 'system').slice(-8);

      const conversationHistory = [
        {
          role: 'system',
          content: fullSystemMessage
        } as ChatMessage,
        ...recentHistory
      ];

      const responseContent = await sendToGroq(conversationHistory);


      // Extract follow-up suggestions with multiple fallback strategies:
      const lines = responseContent.split('\n').filter(l => l.trim());
      const suggestionLines: string[] = [];

      // Common suggestion emoji pattern (AI sometimes uses these instead of 💬)
      const suggestionEmojiPattern = /[💬🟢➡️👉✅🔹🔸💡🎯📌⭐🚀🔵🟡🟠🔴⚡]/u;

      // Strategy 1: Lines starting with 💬 or other common suggestion emojis (ideal case)
      const emojiLines = lines.filter(l => {
        const firstChar = [...l.trim()][0] || '';
        return suggestionEmojiPattern.test(firstChar) || l.trim().startsWith('💬');
      });
      suggestionLines.push(...emojiLines);

      let remainingLines = lines.filter(l => {
        const firstChar = [...l.trim()][0] || '';
        return !suggestionEmojiPattern.test(firstChar) && !l.trim().startsWith('💬');
      });


      // Strategy 1b: Emoji-prefixed suggestion embedded INLINE at end of a paragraph
      // e.g. "...strategic planning and direction. 🟢 Tell me about your interest in working with him."
      if (suggestionLines.length === 0 && remainingLines.length > 0) {
        const lastLine = remainingLines[remainingLines.length - 1];
        const inlineEmojiMatch = lastLine.match(/(.*?[.!?])\s*([💬🟢➡️👉✅🔹🔸💡🎯📌⭐🚀🔵🟡🟠🔴⚡]\s*.{5,120})$/u);
        if (inlineEmojiMatch) {

          const beforeText = inlineEmojiMatch[1].trim();
          const suggestionText = inlineEmojiMatch[2].trim();
          suggestionLines.push(suggestionText);
          remainingLines[remainingLines.length - 1] = beforeText;
          remainingLines = remainingLines.filter(l => l.trim());
        }
      }

      // Strategy 2: Last line ending with ? (standalone follow-up question)
      // ONLY extract if there are at least 2 remaining lines (so message isn't emptied)
      if (suggestionLines.length === 0 && remainingLines.length > 1) {
        const lastLine = remainingLines[remainingLines.length - 1]?.trim() || '';
        if (lastLine.endsWith('?') && !lastLine.startsWith('-') && !lastLine.startsWith('•')) {

          suggestionLines.push(lastLine);
          remainingLines = remainingLines.slice(0, -1);
        }
      }

      // Strategy 3: Extract last sentence ending with ? from a paragraph
      // ONLY if removing it won't leave the message empty
      if (suggestionLines.length === 0 && remainingLines.length > 0) {
        const fullText = remainingLines.join('\n');
        const sentences = fullText.match(/[^.!?\n]*\?/g);
        if (sentences && sentences.length > 0) {
          const lastQuestion = sentences[sentences.length - 1].trim();
          if (lastQuestion.length > 5 && lastQuestion.length < 120) {
            // Only extract if removing it leaves meaningful content
            const idx = fullText.lastIndexOf(lastQuestion);
            const cleaned = (fullText.slice(0, idx) + fullText.slice(idx + lastQuestion.length)).trim();
            if (cleaned.length > 10) {

              suggestionLines.push(lastQuestion);
              remainingLines = cleaned.split('\n').filter(l => l.trim());
            }
          }
        }
      }

      // Strategy 4: Catch trailing imperative sentences embedded inline
      // e.g. "...and direction. Tell me about your interest in working with him."
      if (suggestionLines.length === 0 && remainingLines.length > 0) {
        const lastLine = remainingLines[remainingLines.length - 1];
        const imperativeMatch = lastLine.match(/(.*?[.!?])\s*((?:Tell me|Show me|Ask about|I(?:'d| would) like to|I want to|Help me|Share|Let me know|Inform me)\s.{5,100}[.!?]?)\s*$/);
        if (imperativeMatch) {
          const beforeText = imperativeMatch[1].trim();
          const suggestionText = imperativeMatch[2].trim();
          if (beforeText.length > 10) {

            suggestionLines.push(suggestionText);
            remainingLines[remainingLines.length - 1] = beforeText;
            remainingLines = remainingLines.filter(l => l.trim());
          }
        }
      }


      const cleanedContent = remainingLines.join('\n').trimEnd();

      // Convert bot-perspective suggestions to user-perspective
      const newSuggestions = suggestionLines.map(l => {
        let s = l.replace(/^[\s💬🟢➡️👉✅🔹🔸💡🎯📌⭐🚀🔵🟡🟠🔴⚡]*/, '').trim();

        // ── Convert bot-asking-user questions into user-asking-bot statements ──
        // "Can you share your email/number/details so I can..."
        s = s.replace(/^can you (share|provide|give me|send) your (email|e-mail|phone|number|contact|details).*$/i, 'I want to get in touch');
        // "Share your email/contact"
        s = s.replace(/^share your (email|e-mail|phone|number|contact|details).*$/i, 'I want to get in touch');
        // "Please provide your email"
        s = s.replace(/^please (share|provide|give|send) (me )?(your )?(email|e-mail|phone|number|contact|details).*$/i, 'I want to get in touch');
        // "What is your email/phone?"
        s = s.replace(/^what('s| is) your (email|e-mail|phone|number|contact).*\??$/i, 'I want to get in touch');
        // "Tell me about your project idea/requirements/needs"
        s = s.replace(/^tell me about your (project idea|requirements|needs|project|business|goals)/i, 'Help me plan my project');
        // "What kind of software are you building?"
        s = s.replace(/^what (kind|type) of (software|project|app|website).*\??$/i, 'I want to discuss my project');
        // "Share your requirements"
        s = s.replace(/^share your (requirements|needs|ideas|project details)/i, 'Help me define my requirements');
        // "Tell me more about your X"
        s = s.replace(/^tell me (more )?about your (project|idea|business|company|needs|goals|requirements|budget)/i, 'I want to discuss my $2');
        // "What is your budget?"
        s = s.replace(/^what is your (budget|timeline|deadline)/i, 'Tell me about your pricing and timeline');
        // "Describe your project"
        s = s.replace(/^describe your (project|idea|needs|requirements)/i, 'Help me plan my project');
        // Generic "What do you need?" / "What are you looking for?"
        s = s.replace(/^what (do you need|are you looking for).*\??$/i, 'I need help with my project');
        // Generic "Can you tell me..." (bot asking user)
        s = s.replace(/^can you (tell|share|explain|describe) (me )?(about )?(your|more about your) /i, 'I want to discuss my ');

        // Mixed grammar corrections
        s = s.replace(/^help me explain/i, 'Help me describe');

        // Legacy cleanup conversions:
        s = s.replace(/^would you like to (know|learn|hear) (about|more about)\s*/i, 'Tell me about ');
        s = s.replace(/^would you like to (see|view|check out)\s*/i, 'Show me ');
        s = s.replace(/^would you like to\s*/i, "I'd like to ");
        s = s.replace(/^do you want to\s*/i, 'I want to ');
        s = s.replace(/^shall I\s*/i, 'Please ');
        s = s.replace(/^can I help you with\s*/i, 'Help me with ');
        s = s.replace(/^learn more about (our|the)\s*/i, 'Tell me about your ');
        s = s.replace(/^learn more about\s*/i, 'Tell me about ');
        s = s.replace(/^explore (our|the)\s*/i, 'Show me your ');
        s = s.replace(/^explore\s*/i, 'Show me ');
        s = s.replace(/^check out (our|the)\s*/i, 'Show me your ');
        
        // Final cleanup
        s = s.replace(/\bour\b/gi, 'your');  // Fix "our" to "your"
        
        // If the sentence starts with a user-focused action (Help me, I want, I need, Let me),
        // any "your" followed by user-owned concepts securely becomes "my".
        if (/^(help me|i want to|i need|let me|i'd like to|please)\b/i.test(s)) {
            s = s.replace(/\byour (project|requirements|project requirements|idea|needs|business|company|goals|budget)\b/gi, 'my $1');
        }

        s = s.replace(/\?$/, '');            // Remove trailing '?'
        s = s.charAt(0).toUpperCase() + s.slice(1);
        
        // Failsafe for any missed bot perspectives: if it still has "your " and starts with "Tell me about ", 
        // there's a strong chance the AI completely ignored instructions. Override to generic.
        if (s.toLowerCase().startsWith('tell me about your ') && !s.toLowerCase().includes('pricing') && !s.toLowerCase().includes('process') && !s.toLowerCase().includes('services')) {
            // E.g. "Tell me about your software idea" 
            s = 'I want to start a project';
        }

        // Failsafe: catch any remaining email/contact requests from bot perspective
        if (/\b(share|provide|give|send)\b.*\b(your|you)\b.*\b(email|e-mail|phone|contact|number)\b/i.test(s) ||
            /\b(your|you)\b.*\b(email|e-mail|phone|contact|number)\b.*\b(share|provide|give|send|so i can)\b/i.test(s)) {
            s = 'I want to get in touch';
        }

        return s;
      }).filter(Boolean);

      // Auto-trigger email form: detect email/contact requests in BOTH
      // the suggestion chips AND the AI's response body text
      const emailSuggestionPattern = /\b(email|e-mail|contact|phone|get in touch)\b/i;
      const emailBodyPattern = /\b(share|provide|give|send|drop)\b.{0,30}\b(your|you).{0,15}\b(email|e-mail|phone|contact)\b/i;
      const hasEmailSuggestion = newSuggestions.some(s => emailSuggestionPattern.test(s));
      const hasEmailInBody = emailBodyPattern.test(cleanedContent);

      if ((hasEmailSuggestion || hasEmailInBody) && !hasProvidedEmail) {
        // Remove email-related suggestions — the form replaces them
        const filteredSuggestions = newSuggestions.filter(s => !emailSuggestionPattern.test(s));
        setSuggestions(filteredSuggestions);
        setMessages(prev => [...prev, { role: 'assistant', content: cleanedContent }]);
        // Auto-show the email lead form after a brief delay for natural feel
        setTimeout(() => setShowEmailPrompt(true), 600);
      } else {
        setSuggestions(newSuggestions);
        setMessages(prev => [...prev, { role: 'assistant', content: cleanedContent }]);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Basic Markdown-to-JSX Formatter (Bold, Links, Bullets)
  const formatMessage = useCallback((content: string) => {
    // 1. Pre-process to fix common AI punctuation spacing issues
    let processed = content
      .replace(/\s+([,.?!])/g, '$1')
      .replace(/(\*\*.*?)(([,.?!])\s*)\*\*/g, '$1**$2');

    // 2. Extract ALL links (markdown and raw)
    const linkPlaceholders: { url: string; text: string }[] = [];

    // First: Markdown links [text](url)
    processed = processed.replace(/\[([^\]]*?)]\(([^)]+)\)/g, (_match, text, url) => {
      const idx = linkPlaceholders.length;
      linkPlaceholders.push({ url, text: text.replace(/\*\*/g, '').trim() });
      return `__LINK_${idx}__`;
    });

    // Second: Raw URLs (that aren't already placeholders)
    processed = processed.replace(/(https?:\/\/[^\s)]+)/g, (url) => {
      // Skip if this URL is already inside a placeholder (though the regex above should have consumed it)
      if (processed.includes(`](${url})`)) return url;
      const idx = linkPlaceholders.length;
      linkPlaceholders.push({ url, text: '' });
      return `__LINK_${idx}__`;
    });

    const lines = processed.split('\n');

    // Helper: render inline content (bold, quoted text, + link placeholders)
    const renderInline = (text: string, keyPrefix: string) => {
      // Split by bold, link placeholders, AND double-quoted text
      const parts = text.split(/(\*\*.*?\*\*|__LINK_\d+__|"[^"]{2,}")/g);
      return parts.map((part, i) => {
        // Bold
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${keyPrefix}-b${i}`} className="font-bold text-primary/90">{part.slice(2, -2)}</strong>;
        }
        // Double-quoted text → render as bold italic (no quotes)
        if (part.startsWith('"') && part.endsWith('"') && part.length > 2) {
          return <strong key={`${keyPrefix}-q${i}`} className="font-bold italic text-primary/90">{part.slice(1, -1)}</strong>;
        }
        // Link placeholder → render as a sleek, modern inline card button
        const linkMatch = part.match(/^__LINK_(\d+)__$/);
        if (linkMatch) {
          const link = linkPlaceholders[parseInt(linkMatch[1], 10)];
          return (
            <a
              key={`${keyPrefix}-l${i}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.url}
              className="inline-flex mt-1.5 mb-1 mx-1 items-center gap-2 px-3 py-1.5 bg-background/60 hover:bg-background text-foreground text-xs md:text-[13px] font-semibold rounded-lg border border-border hover:border-primary/50 shadow-sm hover:shadow-primary/20 transition-all duration-300 group align-middle animate-in zoom-in-50 duration-300"
            >
              <span className="truncate max-w-[180px] md:max-w-[220px]">{link.text || 'View Details'}</span>
              <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
          );
        }
        return part;
      });
    };

    return lines.map((line, lineIndex) => {
      // Handle Bullet Points
      const isBullet = /^\s*[*-]\s+/.test(line);
      let cleanLine = line.replace(/^\s*[*-]\s+/, '');

      if (isBullet) {
        // Auto-bold the main point (text before colon) if not already bolded
        const colonIndex = cleanLine.indexOf(':');
        if (colonIndex > 0 && colonIndex < 80 && !cleanLine.includes('**')) {
          cleanLine = `**${cleanLine.substring(0, colonIndex + 1)}**${cleanLine.substring(colonIndex + 1)}`;
        }
      }

      const inlineContent = renderInline(isBullet ? cleanLine : line, `line-${lineIndex}`);

      if (isBullet) {
        return (
          <div key={`line-${lineIndex}`} className="flex gap-2 pl-1 my-0.5 text-[15px] md:text-sm">
            <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
            <span className="flex-1 leading-relaxed">{inlineContent}</span>
          </div>
        );
      }

      return (
        <div key={`line-${lineIndex}`} className={`text-[15px] md:text-sm leading-relaxed ${line.trim() === '' ? 'h-2' : 'mb-1.5 last:mb-0'}`}>
          {inlineContent}
        </div>
      );
    });
  }, []);

  return (
    <>
      {/* Backdrop for mobile - blur entire background and close on click */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[190] bg-background/80 chatbot-overlay-blur md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Chatbot Welcome Popup (Speech Bubble) */}
      <AnimatePresence>
        {!open && showWelcomePopup && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.3, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-[14dvh] sm:bottom-[84px] right-4 sm:right-6 z-[195] flex flex-col items-end pointer-events-none origin-[calc(100%-24px)_calc(100%+24px)]"
          >
            <div className="relative pointer-events-auto cursor-pointer group" onClick={() => setOpen(true)}>
              {/* Main Speech Bubble */}
              <motion.div
                className="relative flex flex-col items-start gap-0.5 bg-card border border-border rounded-xl rounded-br-sm px-3.5 py-1.5 shadow-lg transition-all duration-300 group-hover:-translate-y-1"
              >
                {/* Text Content */}
                <div className="flex flex-col items-start pr-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0 text-primary">
                    ORBIT AI
                  </p>
                  <span className="text-[12px] font-medium text-foreground tracking-wide whitespace-nowrap transition-all duration-300">
                    {isTypingAnim ? typingText : (chatLang === 'bn' ? popupMessage.bn : popupMessage.en)}
                    {isTypingAnim && <span className="inline-block w-[2px] h-[14px] bg-primary ml-[1px] animate-pulse" />}
                  </span>
                </div>
              </motion.div>

              {/* Speech Bubble Tail */}
              <motion.div
                className="absolute -bottom-[5px] right-5 sm:right-7 w-2.5 h-2.5 bg-card border-b border-r border-border rotate-45 transform"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button - hide on mobile when chat is open since we have a new close button */}
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`fixed bottom-[6dvh] md:bottom-4 right-4 sm:right-6 z-[200] flex items-center justify-center cursor-pointer transition-all duration-300 ${open
          ? 'w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground shadow-xl hidden md:flex'
          : 'w-14 h-14 sm:w-[72px] sm:h-[72px] bg-transparent'
          }`}
        style={{ willChange: 'opacity' }}
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <div className="chatbot-float-icon relative w-full h-full flex items-center justify-center">
            <DotLottieReact
              src="/robot.json"
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            style={{
              ...viewportStyle,
              transformOrigin: 'bottom',
            }}
            className={`fixed md:bottom-[84px] left-0 right-0 md:left-auto md:right-6 z-[200] w-full md:w-[400px] max-w-full md:max-w-[400px] overflow-hidden bg-card border border-border shadow-2xl flex flex-col h-[100dvh] md:h-auto top-0 md:top-auto ${isKeyboardOpen && typeof window !== 'undefined' && window.innerWidth < 768 ? 'rounded-none border-t-0' : 'bottom-0 rounded-t-3xl md:rounded-2xl'}`}
          >
            {/* Header */}
            <div className="shrink-0 px-5 py-3.5 bg-primary/20 border-b border-border flex items-center justify-between relative">
              <div>
                <h4 className="font-semibold text-foreground text-sm leading-tight">
                  {chatContentMemo.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    {chatLang === 'bn' ? 'অনলাইন' : 'Online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 chatbot-menu-container">
                {/* Control Pill */}
                <div className="flex items-center gap-1 bg-secondary/80 p-0.5 rounded-full border border-border/50 shadow-sm">
                  {/* Actions Menu Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className={`w-7 h-7 flex items-center justify-center rounded-full transition-all cursor-pointer ${showMenu ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background/50 text-muted-foreground hover:text-foreground hover:bg-background'}`}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute right-0 mt-3 w-48 rounded-2xl bg-card border border-border shadow-2xl z-[210] py-2 overflow-hidden ring-1 ring-black/5"
                        >
                          {/* Lang Selector inside Menu */}
                          <div className="px-4 py-2 border-b border-border/50">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                              {chatLang === 'bn' ? 'ভাষা নির্বাচন করুন' : 'Select Language'}
                            </p>
                            <div className="flex bg-secondary p-0.5 rounded-lg border border-border/50">
                              <button
                                onClick={() => { setChatLang('en'); setShowMenu(false); }}
                                className={`flex-1 px-2 py-1.5 text-[10px] font-bold rounded-md transition-all ${chatLang === 'en' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                              >
                                English
                              </button>
                              <button
                                onClick={() => { setChatLang('bn'); setShowMenu(false); }}
                                className={`flex-1 px-2 py-1.5 text-[10px] font-bold rounded-md transition-all ${chatLang === 'bn' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                              >
                                বাংলা
                              </button>
                            </div>
                          </div>

                          {/* Clear Chat inside Menu */}
                          <button
                            onClick={() => { clearChat(); setShowMenu(false); }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {chatLang === 'bn' ? 'চ্যাট মুছুন' : 'Clear Conversation'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Minimize Button */}
                  <button
                    onClick={() => setOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-background/50 text-muted-foreground hover:text-foreground hover:bg-background transition-all cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chatbot-messages-area flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-background/40 md:bg-card/40 md:max-h-[500px] relative">
              <div className="space-y-3 transition-all duration-500">
                {/* Initial Selection Flow */}
                {messages.length === 0 && !isLoading && (
                  <div className="space-y-4 py-2">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted border border-border rounded-xl rounded-tl-none px-3 py-2 text-xs text-foreground max-w-[85%] leading-relaxed">
                        <p className="font-bold mb-1 uppercase tracking-widest text-[10px] text-primary">
                          {chatLang === 'bn' ? 'স্বাগতম!' : 'Welcome!'}
                        </p>
                        {chatLang === 'bn'
                          ? 'শুরু করার জন্য আপনার পছন্দের ভাষাটি নির্বাচন করুন:'
                          : 'Please select your preferred language to begin:'}
                      </div>
                    </div>
                    <div className="flex gap-2 pl-9">
                      <button
                        onClick={() => setChatLang('en')}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all shadow-sm ${chatLang === 'en' ? 'bg-primary border-primary text-primary-foreground shadow-primary/20' : 'bg-background border-border text-muted-foreground hover:border-primary/40'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setChatLang('bn')}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all shadow-sm ${chatLang === 'bn' ? 'bg-primary border-primary text-primary-foreground shadow-primary/20' : 'bg-background border-border text-muted-foreground hover:border-primary/40'}`}
                      >
                        বাংলা
                      </button>
                    </div>
                  </div>
                )}

                {messages.filter(m => m.role !== 'system').map((msg, i) => {
                  const isAssistant = msg.role === 'assistant';
                  const hasSwitchSuggestion = isAssistant && msg.content.includes('[SUGGEST_SWITCH]');
                  const cleanContent = isAssistant ? msg.content.replace('[SUGGEST_SWITCH]', '').trim() : msg.content;

                  return (
                    <div key={i} className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {isAssistant && (
                          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-foreground" />
                          </div>
                        )}
                        <div className={`rounded-xl px-3 py-2 text-[15px] md:text-sm max-w-[85%] border ${msg.role === 'user'
                          ? 'bg-emerald-600 text-white border-emerald-600 rounded-tr-none'
                          : 'bg-muted border-border text-foreground rounded-tl-none'
                          }`}>
                          {isAssistant ? formatMessage(cleanContent) : msg.content}
                        </div>
                      </div>
                      {hasSwitchSuggestion && (
                        <div className="flex justify-start ml-9 pb-1">
                          <button
                            onClick={() => setChatLang(chatLang === 'en' ? 'bn' : 'en')}
                            className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer ring-2 ring-primary/20"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            {chatLang === 'en' ? 'বাংলায় কথা বলুন' : 'Switch to English'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Email Prompt Native Chat Bubble */}
                {showEmailPrompt && !hasProvidedEmail && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="bg-muted rounded-xl rounded-tl-none px-4 py-3 text-base md:text-[15px] text-foreground max-w-[90%] border border-border">
                        <p className="mb-3 text-[15px] md:text-sm leading-relaxed font-medium">
                          {chatLang === 'bn'
                            ? 'অবশ্যই, আমি সাহায্য করতে পারি। তবে আমাদের সংযোগ বিচ্ছিন্ন হয়ে গেলে, আমি কোথায় উত্তর পাঠাবো? আপনার ইমেইলটি দিন:'
                            : 'Definitely I can help with that. In case we get disconnected, what is your email address?'}
                        </p>
                        <form onSubmit={handleLeadSubmit} className="flex flex-col gap-2 relative z-10">
                          <input
                            type="email"
                            required
                            placeholder={chatLang === 'bn' ? 'আপনার ইমেইল...' : 'Your email address...'}
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            disabled={leadStatus === 'loading'}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-base md:text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pointer-events-auto"
                          />
                          <button
                            type="submit"
                            disabled={leadStatus === 'loading' || !leadEmail}
                            className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 text-xs transition-opacity cursor-pointer pointer-events-auto"
                          >
                            {leadStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            {chatLang === 'bn' ? 'উত্তর পান' : 'Send & Continue'}
                          </button>
                          <p className="text-[9px] text-muted-foreground text-center mt-1">
                            {chatLang === 'bn' ? 'আমরা স্প্যাম করি না।' : '100% Secure. No spam.'}
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="bg-muted border border-border rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white" style={{ animation: 'dotBounce 1.4s ease-in-out infinite' }} />
                      <span className="w-2 h-2 rounded-full bg-white" style={{ animation: 'dotBounce 1.4s ease-in-out 0.2s infinite' }} />
                      <span className="w-2 h-2 rounded-full bg-white" style={{ animation: 'dotBounce 1.4s ease-in-out 0.4s infinite' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
                <div ref={messagesEndRef} />
              </div> {/* End of blurred wrapper */}
            </div>

            {/* Suggestion Chips */}
            {(() => {
              const defaultChips = chatLang === 'bn'
                ? ['তোমাদের সেবাগুলো কি?', 'প্রজেক্টগুলো দেখাও', 'প্রাইসিং কেমন?', 'যোগাযোগ করতে চাই']
                : ['What services do you offer?', 'Show me your projects', 'Tell me about pricing', 'I want to contact you'];
              const activeChips = suggestions.length > 0 ? suggestions : (messages.length <= 1 ? defaultChips : []);
              return activeChips.length > 0 && !isLoading ? (
                <div className={`shrink-0 px-4 pt-2 pb-0 bg-card/80 transition-opacity ${showEmailPrompt ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {activeChips.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSuggestions([]);
                          setInput(s);
                          setTimeout(() => {
                            const userMessage: ChatMessage = { role: 'user', content: s };
                            const newMessages = [...messages, userMessage];
                            setMessages(newMessages);
                            setInput('');

                            // Email gate: on 2nd question, show email form before AI reply
                            const userMsgCount = newMessages.filter(m => m.role === 'user').length;
                            if (userMsgCount >= 2 && !hasProvidedEmail) {
                              pendingMessagesRef.current = newMessages;
                              setShowEmailPrompt(true);
                              return;
                            }

                            setIsLoading(true);
                            executeAIResponse(newMessages);
                          }, 50);
                        }}
                        className="shrink-0 px-4 py-2 rounded-full text-[11px] font-bold bg-muted text-foreground border border-border hover:bg-muted-foreground/10 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Input & Mobile Close Button */}
            <div className="chatbot-input-area shrink-0 relative">
              <div className={`px-4 py-3 pb-6 md:pb-3 ${suggestions.length > 0 && !isLoading ? 'pt-2' : ''} flex gap-2 bg-card/90 backdrop-blur-md transition-opacity ${showEmailPrompt ? 'opacity-40 pointer-events-none' : ''}`}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  onFocus={(e) => {
                    // Prevent the browser from scrolling the page to bring input into view
                    if (window.innerWidth < 768) {
                      e.target.scrollIntoView({ block: 'nearest' });
                      setTimeout(() => window.scrollTo(0, 0), 50);
                      setTimeout(() => window.scrollTo(0, 0), 150);
                      setTimeout(() => window.scrollTo(0, 0), 300);
                    }
                  }}
                  placeholder={chatContentMemo.placeholder}
                  disabled={isLoading}
                  enterKeyHint="send"
                  // Prevent auto-focus on open to stop keyboard jumping
                  autoFocus={false}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-base md:text-[15px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
