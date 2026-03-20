import React from 'react';

/**
 * Markdown-to-JSX formatter for chat messages.
 * Handles bold, links, bullet points, quoted text, and timeline/roadmap detection.
 */
export function formatMessage(content: string): React.ReactNode {
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
    if (processed.includes(`](${url})`)) return url;
    const idx = linkPlaceholders.length;
    linkPlaceholders.push({ url, text: '' });
    return `__LINK_${idx}__`;
  });

  const lines = processed.split('\n');

  // Helper: render inline content (bold, quoted text, + link placeholders)
  const renderInline = (text: string, keyPrefix: string) => {
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

  // ── TIMELINE/ROADMAP DETECTION ──
  const numberedStepPattern = /^(?:\*\*)?(\d+)[.)]\s*(.+?)(?:\*\*)?$/;
  const steps: { num: string; title: string; desc: string }[] = [];
  const preLines: string[] = [];
  const postLines: string[] = [];
  let inSteps = false;
  let doneSteps = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inSteps) continue;
      if (doneSteps) { postLines.push(line); continue; }
      preLines.push(line);
      continue;
    }

    const cleanForStep = trimmed.replace(/^[\s*-]*/, '');
    const stepMatch = cleanForStep.match(numberedStepPattern);

    if (stepMatch) {
      inSteps = true;
      const num = stepMatch[1];
      const rest = stepMatch[2].replace(/\*\*/g, '').trim();
      const sepMatch = rest.match(/^(.+?)[\s]*[:–—-][\s]*(.+)$/);
      if (sepMatch) {
        steps.push({ num, title: sepMatch[1].trim(), desc: sepMatch[2].trim() });
      } else {
        steps.push({ num, title: rest, desc: '' });
      }
    } else if (inSteps && !doneSteps) {
      doneSteps = true;
      postLines.push(line);
    } else if (!inSteps) {
      preLines.push(line);
    } else {
      postLines.push(line);
    }
  }

  // Render timeline if 2+ steps detected
  if (steps.length >= 2) {
    const renderTextLines = (textLines: string[]) =>
      textLines.map((line, li) => {
        const isBullet = /^\s*[*-]\s+/.test(line);
        let cleanLine = line.replace(/^\s*[*-]\s+/, '');
        if (isBullet) {
          const colonIndex = cleanLine.indexOf(':');
          if (colonIndex > 0 && colonIndex < 80 && !cleanLine.includes('**')) {
            cleanLine = `**${cleanLine.substring(0, colonIndex + 1)}**${cleanLine.substring(colonIndex + 1)}`;
          }
        }
        const inline = renderInline(isBullet ? cleanLine : line, `tl-${li}`);
        if (isBullet) {
          return (
            <div key={`tl-${li}`} className="flex gap-2 pl-1 my-0.5 text-[15px] md:text-sm">
              <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
              <span className="flex-1 leading-relaxed">{inline}</span>
            </div>
          );
        }
        return (
          <div key={`tl-${li}`} className={`text-[15px] md:text-sm leading-relaxed ${line.trim() === '' ? 'h-2' : 'mb-1.5 last:mb-0'}`}>
            {inline}
          </div>
        );
      });

    return (
      <>
        {/* Pre-timeline text */}
        {preLines.filter(l => l.trim()).length > 0 && renderTextLines(preLines)}

        {/* Timeline */}
        <div className="relative mt-3 mb-2 ml-1">
          {steps.map((step, idx) => (
            <div key={`step-${idx}`} className="relative flex gap-3 pb-4 last:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 120}ms` }}>
              {/* Vertical line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-[15px] top-[34px] bottom-0 w-[2px] bg-gradient-to-b from-primary/60 to-primary/10" />
              )}
              {/* Step number circle */}
              <div className="relative z-10 shrink-0 w-[32px] h-[32px] rounded-full border-2 border-primary bg-primary/15 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <span className="text-[11px] font-black text-primary leading-none">
                  {step.num.padStart(2, '0')}
                </span>
              </div>
              {/* Content card */}
              <div className="flex-1 bg-background/60 border border-border/60 rounded-lg px-3 py-2 min-w-0 shadow-sm">
                <p className="text-[10px] font-bold text-primary/70 uppercase tracking-[0.15em] mb-0.5">
                  Step {step.num.padStart(2, '0')}
                </p>
                <p className="text-[13px] md:text-xs font-bold text-foreground leading-snug">
                  {renderInline(step.title, `st-${idx}`)}
                </p>
                {step.desc && (
                  <p className="text-[12px] md:text-[11px] text-muted-foreground leading-relaxed mt-1">
                    {renderInline(step.desc, `sd-${idx}`)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Post-timeline text */}
        {postLines.filter(l => l.trim()).length > 0 && renderTextLines(postLines)}
      </>
    );
  }

  // ── DEFAULT LINE-BY-LINE RENDERING (no timeline detected) ──
  return lines.map((line, lineIndex) => {
    const isBullet = /^\s*[*-]\s+/.test(line);
    let cleanLine = line.replace(/^\s*[*-]\s+/, '');

    if (isBullet) {
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
}
