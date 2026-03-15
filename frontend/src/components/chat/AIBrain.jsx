import React from 'react';

const AIBrain = ({ isTyping }) => {
    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-0 opacity-40">

            {/* Halo de base (grossit quand l'IA réfléchit) */}
            <div
                className={`absolute rounded-full blur-3xl transition-all duration-700 ease-in-out ${isTyping
                    ? 'w-96 h-96 bg-brand-lime/30'
                    : 'w-64 h-64 bg-brand-lime/10'
                    }`}
            />

            {/* Le Cœur / Noyau central */}
            <div
                className={`relative flex items-center justify-center transition-all duration-700 ${isTyping ? 'scale-110' : 'scale-100'
                    }`}
            >
                {/* Anneau Externe (Rotation lente) */}
                <div
                    className={`absolute rounded-full border border-dashed border-brand-lime/30 transition-all duration-1000 ${isTyping ? 'w-80 h-80 animate-[spin_8s_linear_infinite] border-brand-lime/60' : 'w-72 h-72 animate-[spin_20s_linear_infinite]'
                        }`}
                />

                {/* Anneau Intermédiaire (Rotation inversée) */}
                <div
                    className={`absolute rounded-full border-t-2 border-l-2 border-brand-lime/40 transition-all duration-1000 ${isTyping ? 'w-64 h-64 animate-[spin_4s_linear_infinite_reverse] border-brand-lime/80 shadow-[0_0_30px_rgba(212,255,58,0.4)]' : 'w-56 h-56 animate-[spin_15s_linear_infinite_reverse]'
                        }`}
                />

                {/* Cerveau géométrique central */}
                <div
                    className={`relative z-10 w-24 h-24 flex items-center justify-center transition-all duration-500 ${isTyping ? 'animate-pulse' : ''
                        }`}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full text-brand-lime overflow-visible">
                        {/* Polygone de base du cerveau */}
                        <polygon
                            points="50,15 85,35 85,65 50,85 15,65 15,35"
                            fill={isTyping ? "rgba(212, 255, 58, 0.15)" : "transparent"}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className={`transition-all duration-700 ${isTyping ? 'drop-shadow-[0_0_15px_rgba(212,255,58,0.8)]' : 'drop-shadow-[0_0_5px_rgba(212,255,58,0.3)]'}`}
                        />

                        {/* Nœuds neuronaux (Points) */}
                        <circle cx="50" cy="15" r="3" fill="currentColor" />
                        <circle cx="85" cy="35" r="3" fill="currentColor" />
                        <circle cx="85" cy="65" r="3" fill="currentColor" />
                        <circle cx="50" cy="85" r="3" fill="currentColor" />
                        <circle cx="15" cy="65" r="3" fill="currentColor" />
                        <circle cx="15" cy="35" r="3" fill="currentColor" />
                        <circle cx="50" cy="50" r="4" fill="currentColor" className={isTyping ? "animate-ping origin-center" : ""} />

                        {/* Connexions internes synaptiques */}
                        <line x1="50" y1="15" x2="50" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray={isTyping ? "2 2" : "0"} className={isTyping ? "animate-[dash_1s_linear_infinite]" : ""} />
                        <line x1="85" y1="35" x2="50" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray={isTyping ? "2 2" : "0"} className={isTyping ? "animate-[dash_1s_linear_infinite]" : ""} />
                        <line x1="85" y1="65" x2="50" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray={isTyping ? "2 2" : "0"} className={isTyping ? "animate-[dash_1s_linear_infinite]" : ""} />
                        <line x1="50" y1="85" x2="50" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray={isTyping ? "2 2" : "0"} className={isTyping ? "animate-[dash_1s_linear_infinite]" : ""} />
                        <line x1="15" y1="65" x2="50" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray={isTyping ? "2 2" : "0"} className={isTyping ? "animate-[dash_1s_linear_infinite]" : ""} />
                        <line x1="15" y1="35" x2="50" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray={isTyping ? "2 2" : "0"} className={isTyping ? "animate-[dash_1s_linear_infinite]" : ""} />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default AIBrain;
