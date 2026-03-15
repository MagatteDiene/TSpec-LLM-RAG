import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import AIBrain from './AIBrain';

const ChatContainer = ({ messages, isTyping, error, sendMessage }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    return (
        <>
            {/* L'IA Visuelle en arrière-plan */}
            <AIBrain isTyping={isTyping} />

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth z-10 pb-6 relative">
                <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full relative z-20">
                    {messages.map((msg, index) => (
                        // Applique l'animation fade-in-up en cascade pour les historiques
                        <div key={msg.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }}>
                            <ChatBubble {...msg} />
                        </div>
                    ))}

                    {isTyping && (
                        <div className="animate-fade-in-up flex w-full gap-4 items-end mb-2">
                            <div className="flex-shrink-0 w-9 h-9 rounded-xl glass-panel text-brand-lime flex items-center justify-center shadow-lg border border-brand-lime/20 mb-2">
                                <div className="w-2.5 h-2.5 bg-brand-lime rounded-[3px] animate-pulse" />
                            </div>
                            <div className="flex items-center gap-2 px-6 py-4 rounded-2xl rounded-bl-sm glass-panel">
                                <div className="flex space-x-2 items-center p-1">
                                    <div className="w-2 h-2 bg-brand-lime/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-brand-lime/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-brand-lime/60 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mx-auto w-full max-w-md p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 text-center font-medium backdrop-blur-md animate-fade-in-up">
                            {error}
                        </div>
                    )}

                    <div className="h-4" />
                </div>
            </div>

            <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
        </>
    );
};

export default ChatContainer;
