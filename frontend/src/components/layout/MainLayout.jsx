import React from 'react';
import Header from './Header';
import AnimatedBackground from './AnimatedBackground';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen w-full bg-brand-bg overflow-hidden font-sans relative">
            <AnimatedBackground />

            <Header />
            {/* Wrapper principal */}
            <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col relative z-10 min-h-0 overflow-hidden">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
