import { Bot } from 'lucide-react';
import { useChatContext } from '../ChatContext';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatEmailPrompt } from './ChatEmailPrompt';

export function ChatMessageList() {
  const { messages, chatLang, setChatLang, isLoading, messagesEndRef } = useChatContext();

  return (
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

        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <ChatMessageBubble key={i} msg={msg} index={i} />
        ))}

        {/* Email Prompt */}
        <ChatEmailPrompt />

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
      </div>
    </div>
  );
}
