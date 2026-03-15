import React, { useState, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const ChatBubble = ({ text, isBot }) => {
    // État pour l'effet de frappe
    const [displayedText, setDisplayedText] = useState(isBot ? '' : text);
    const [isTyping, setIsTyping] = useState(isBot);

    useEffect(() => {
        if (isBot) {
            let i = 0;
            // On s'assure de réinitialiser si le texte change bizarrement
            setDisplayedText('');
            setIsTyping(true);

            const intervalId = setInterval(() => {
                setDisplayedText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(intervalId);
                    setIsTyping(false);
                }
            }, 10); // Vitesse de frappe (20ms par caractère)

            return () => clearInterval(intervalId);
        } else {
            setDisplayedText(text);
        }
    }, [text, isBot]);

    return (
        <div className={`flex w-full gap-4 ${isBot ? 'flex-row' : 'flex-row-reverse'} group`}>
            {/* Avatar Glassmorphism minimaliste */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 mt-2 ${isBot
                ? 'glass-panel text-brand-lime border-brand-lime/30'
                : 'bg-gradient-to-br from-brand-lime to-brand-lime-hover text-[#101115] shadow-[0_0_15px_rgba(212,255,58,0.2)]'
                }`}>
                {isBot ? (
                    <Bot size={18} strokeWidth={2.5} />
                ) : (
                    <User size={18} strokeWidth={2.5} />
                )}
            </div>

            <div className={`flex flex-col max-w-[85%] ${isBot ? 'items-start' : 'items-end'}`}>
                {/* Style des bulles glassmorphism & néon */}
                <div className={`px-6 py-4 text-[15px] leading-relaxed relative ${isBot
                    ? 'glass-panel text-brand-text rounded-2xl rounded-tl-sm'
                    : 'bg-brand-lime text-[#101115] rounded-2xl rounded-tr-sm font-medium shadow-[0_4px_20px_rgba(212,255,58,0.25)]'
                    }`}>
                    {/* Subtle reflection effect for bot bubble */}
                    {isBot && <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl rounded-tl-sm pointer-events-none" />}

                    <div className="relative z-10 w-full overflow-hidden">
                        {isBot ? (
                            <div className="prose prose-invert prose-sm max-w-none 
                                prose-p:my-1 prose-p:leading-relaxed
                                prose-headings:text-brand-lime prose-headings:my-2 prose-headings:font-semibold
                                prose-strong:text-brand-lime/90 prose-strong:font-bold
                                prose-em:text-brand-muted prose-em:italic
                                prose-blockquote:border-l-2 prose-blockquote:border-brand-lime/40 prose-blockquote:bg-brand-lime/5 prose-blockquote:pl-3 prose-blockquote:py-1 prose-blockquote:my-2 prose-blockquote:not-italic
                                prose-ul:my-2 prose-li:my-0.5
                                prose-table:w-full prose-table:border-collapse prose-table:my-2
                                prose-th:border prose-th:border-white/20 prose-th:p-2 prose-th:bg-white/5
                                prose-td:border prose-td:border-white/10 prose-td:p-2
                                prose-a:text-brand-lime prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-brand-lime-hover
                                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {displayedText + (isTyping ? " <span class='text-brand-lime animate-pulse inline-block align-middle relative -top-[1px] ml-1 text-[12px]'>█</span>" : "")}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap">{displayedText}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
