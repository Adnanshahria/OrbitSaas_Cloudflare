import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * useCollisionSound — synthesized "dhurum" impact sound via Web Audio API.
 *
 * Returns `playBoom()` function. Sound respects user's mute preference
 * stored in localStorage ('orbit_sound_muted').
 *
 * AudioContext is lazily created and unlocked on first user interaction.
 */
export function useCollisionSound() {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const audioUnlockedRef = useRef(false);
    const mutedRef = useRef(false);

    // Load mute preference
    useEffect(() => {
        mutedRef.current = localStorage.getItem('orbit_sound_muted') === 'true';
    }, []);

    // Listen for mute toggle events from other components
    useEffect(() => {
        const handler = () => {
            mutedRef.current = localStorage.getItem('orbit_sound_muted') === 'true';
        };
        window.addEventListener('orbit-sound-toggle', handler);
        return () => window.removeEventListener('orbit-sound-toggle', handler);
    }, []);

    // Unlock AudioContext on first user interaction (required by browsers)
    useEffect(() => {
        const unlock = () => {
            if (audioUnlockedRef.current) return;
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            audioUnlockedRef.current = true;
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        return () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('keydown', unlock);
        };
    }, []);

    const playBoom = useCallback(() => {
        if (mutedRef.current) return;

        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') { ctx.resume(); }
            const now = ctx.currentTime;

            // "DHU" — punchy sine attack, fast pitch drop like a bass kick drum
            const kick = ctx.createOscillator();
            kick.type = 'sine';
            kick.frequency.setValueAtTime(500, now);
            kick.frequency.exponentialRampToValueAtTime(55, now + 0.12);

            const kickGain = ctx.createGain();
            kickGain.gain.setValueAtTime(0.9, now);
            kickGain.gain.setValueAtTime(0.7, now + 0.02);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            kick.connect(kickGain);
            kickGain.connect(ctx.destination);
            kick.start(now);
            kick.stop(now + 0.55);

            // "RUM" — resonant body, slightly delayed, lower & sustained
            const body = ctx.createOscillator();
            body.type = 'sine';
            body.frequency.setValueAtTime(180, now + 0.03);
            body.frequency.exponentialRampToValueAtTime(70, now + 0.25);

            const bodyGain = ctx.createGain();
            bodyGain.gain.setValueAtTime(0.001, now);
            bodyGain.gain.linearRampToValueAtTime(0.6, now + 0.04);
            bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            body.connect(bodyGain);
            bodyGain.connect(ctx.destination);
            body.start(now);
            body.stop(now + 0.65);

            // Thud click — the initial "hit" transient
            const bufLen = Math.floor(ctx.sampleRate * 0.02);
            const clickBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
            const cd = clickBuf.getChannelData(0);
            for (let i = 0; i < bufLen; i++) {
                cd[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
            }
            const clickSrc = ctx.createBufferSource();
            clickSrc.buffer = clickBuf;
            const clickGain = ctx.createGain();
            clickGain.gain.setValueAtTime(0.35, now);
            clickSrc.connect(clickGain);
            clickGain.connect(ctx.destination);
            clickSrc.start(now);
        } catch {
            // Silently fail
        }
    }, []);

    return { playBoom };
}

/**
 * SoundToggle — small floating mute/unmute button.
 * Shows a speaker icon on mobile (bottom-left corner).
 */
export function SoundToggle() {
    const [muted, setMuted] = useState(
        () => localStorage.getItem('orbit_sound_muted') === 'true'
    );

    const toggle = () => {
        const next = !muted;
        setMuted(next);
        localStorage.setItem('orbit_sound_muted', String(next));
        window.dispatchEvent(new Event('orbit-sound-toggle'));
    };

    return (
        <button
            onClick={toggle}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            className="fixed bottom-[10dvh] left-4 z-[100] md:bottom-6 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 cursor-pointer sm:hidden"
            title={muted ? 'Sound OFF' : 'Sound ON'}
        >
            {muted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <line x1="23" x2="17" y1="9" y2="15" />
                    <line x1="17" x2="23" y1="9" y2="15" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
            )}
        </button>
    );
}
