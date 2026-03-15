import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap } from 'lucide-react';

const ChatInput = ({ onSendMessage, isTyping }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    // Re-focus input after bot finishes typing
    useEffect(() => {
        if (!isTyping && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && !isTyping) {
            onSendMessage(text.trim());
            setText('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleChange = (e) => {
        setText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
        }
    };

    return (
        <div className="px-4 pb-8 pt-4 shrink-0 z-20 relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-[#121318] before:via-[#121318] before:to-transparent before:-z-10">
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto relative flex items-end gap-3 glass-panel rounded-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)] focus-within:ring-1 focus-within:ring-brand-lime/40 focus-within:bg-[#1C1E26]/80 transition-all duration-300 group"
            >
                <div className="flex-1 flex items-center bg-black/20 rounded-xl px-4 py-1 border border-white/5 transition-colors group-focus-within:bg-black/30 group-focus-within:border-white/10">
                    <Zap size={16} className="text-brand-lime/50 mr-2 shrink-0 group-focus-within:text-brand-lime transition-colors" />
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Rechercher dans les spécifications 3GPP..."
                        className="flex-1 max-h-[150px] min-h-[40px] resize-none bg-transparent outline-none overflow-y-auto leading-relaxed py-2.5 text-brand-text placeholder-brand-muted/50 text-[15px] no-scrollbar"
                        rows={1}
                        disabled={isTyping}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!text.trim() || isTyping}
                    className="p-3.5 mb-0.5 rounded-xl bg-gradient-to-br from-brand-lime to-brand-lime-hover text-[#101115] flex-shrink-0 hover:shadow-[0_0_20px_rgba(212,255,58,0.4)] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-300 cursor-pointer"
                >
                    <Send size={18} strokeWidth={2.5} className={text.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                </button>
            </form>
            <div className="text-center mt-4 text-[11px] text-brand-muted/50 tracking-widest font-semibold uppercase flex items-center justify-center gap-2">
                <span className="w-8 h-[1px] bg-brand-muted/20"></span>
                © 2026 by Pape Magatte Ndiaye DIENE
                <span className="w-8 h-[1px] bg-brand-muted/20"></span>
            </div>
        </div>
    );
};

export default ChatInput;
