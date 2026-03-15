import React from 'react';

const Header = () => {
    return (
        <header className="w-full flex items-center justify-between px-8 py-4 glass-header shrink-0 z-20 relative">
            <div className="flex items-center gap-4">
                {/* Logo Icon with glowing effect */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-lime to-brand-lime-hover flex items-center justify-center shadow-[0_0_20px_rgba(212,255,58,0.3)]">
                    <div className="w-4 h-4 bg-brand-bg rounded-[4px]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-brand-text tracking-tight">TSpec-LLM RAG</h1>
                    <p className="text-[11px] text-brand-lime/80 font-bold tracking-widest uppercase">3GPP Assistant Technique</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-sm shadow-sm text-brand-lime font-semibold px-4 py-2 rounded-xl border border-brand-lime/20 bg-brand-lime/10 shadow-[0_0_15px_rgba(212,255,58,0.1)]">
                    Système de Q&A Télécom 3GPP
                </div>
            </div>
        </header>
    );
};

export default Header;
