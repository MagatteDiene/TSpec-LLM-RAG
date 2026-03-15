import React from 'react';

const Header = () => {
    return (
        <header className="w-full flex items-center justify-between px-4 sm:px-8 py-4 glass-header shrink-0 z-20 relative">
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Logo Icon with glowing effect */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-lime to-brand-lime-hover flex items-center justify-center shadow-[0_0_20px_rgba(212,255,58,0.3)] shrink-0">
                    <div className="w-4 h-4 bg-brand-bg rounded-[4px]" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold text-brand-text tracking-tight truncate">TSpec-LLM RAG</h1>
                    <p className="text-[10px] sm:text-[11px] text-brand-lime/80 font-bold tracking-widest uppercase truncate">3GPP Assistant Technique</p>
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <div className="text-[10px] sm:text-xs md:text-sm shadow-sm text-brand-lime font-semibold px-2.5 sm:px-4 py-1 sm:py-2 rounded-xl border border-brand-lime/20 bg-brand-lime/10 shadow-[0_0_15px_rgba(212,255,58,0.1)]">
                    <span className="xs:hidden">3GPP Q&A</span>
                    <span className="hidden xs:inline">Système Q&A Télécom</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
