import React from 'react';

const AnimatedBackground = () => {
    // Génère des "paquets de données" (particules) aléatoires pour l'effet réseau
    const particles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        // Tailles discrètes (1px à 3px)
        size: Math.random() * 2 + 1,
        // Position aléatoire initiale
        left: `${Math.random() * 100}%`,
        // Position verticale initiale
        top: `${Math.random() * 100}%`,
        // Vitesse variable (15s à 35s pour un mouvement très subtil et fluide)
        duration: Math.random() * 20 + 15,
        // Décalage des animations pour qu'elles ne partent pas toutes en même temps
        delay: Math.random() * -30,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 1. Les auras / orbes floutées en arrière plan (issues du design existant) */}
            <div className="bg-glow-1 top-[-10%] left-[-10%]"></div>
            <div className="bg-glow-2 bottom-[-10%] right-[-10%]"></div>

            {/* 2. Matrice de points (Dotted Matrix) : Donne un aspect Data ultra subtil et moderne */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1.5px,transparent_1.5px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)] opacity-80 mix-blend-screen"></div>

            {/* 3. Flux de données (Particules flottantes) */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute bg-brand-lime rounded-full opacity-0 animate-data-flow shadow-[0_0_10px_rgba(212,255,58,0.8)]"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: p.left,
                        top: p.top,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default AnimatedBackground;
