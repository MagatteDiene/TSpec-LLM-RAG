import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Component } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SourceList = ({ filePath, sources, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Safely get filename or fallback
    const fileName = filePath ? filePath.split('/').pop() : `Document ${index + 1}`;
    // Get release from first source if available
    const releaseVersion = sources[0]?.metadata?.release;

    return (
        <div className="mt-2 glass-panel rounded-xl overflow-hidden transition-all duration-300 border-white/5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] transition-colors focus:outline-none"
            >
                <div className="flex items-center gap-2 sm:gap-3 text-[13px] sm:text-sm text-brand-text font-medium text-left">
                    <div className="p-1 sm:p-1.5 rounded-lg bg-black/40 text-brand-lime/80 border border-white/5 shadow-inner shrink-0">
                        <FileText size={12} sm:size={14} />
                    </div>
                    <span className="opacity-90 max-w-[120px] sm:max-w-[200px] truncate" title={fileName}>
                        {fileName}
                    </span>

                    {/* Badge count to show how many chunks from this file */}
                    {sources.length > 1 && (
                        <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-white/10 text-brand-muted rounded-md shrink-0">
                            {sources.length} <span className="hidden xs:inline">parties</span>
                        </span>
                    )}

                    {releaseVersion && (
                        <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 bg-brand-lime/10 text-brand-lime border border-brand-lime/20 rounded-md tracking-wider shrink-0 hidden xs:inline-block">
                            {releaseVersion}
                        </span>
                    )}
                </div>
                <div className="flex border border-white/10 rounded-full p-0.5 sm:p-1 bg-black/20 shrink-0 ml-1 sm:ml-2">
                    {isOpen ? <ChevronDown size={12} sm:size={14} className="text-brand-lime" /> : <ChevronRight size={12} sm:size={14} className="text-brand-muted" />}
                </div>
            </button>

            {isOpen && (
                <div className="px-5 py-4 text-sm text-brand-muted border-t border-white/5 bg-black/20 relative animate-fade-in-up transition-all" style={{ animationDuration: '0.2s' }}>
                    {/* Neon line indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-lime via-brand-lime/50 to-transparent shadow-[0_0_8px_rgba(212,255,58,0.8)]" />

                    <div className="flex flex-col gap-4">
                        {sources.map((src, idx) => {
                            const meta = src.metadata || {};
                            return (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-2 top-1 bottom-1 w-[1px] bg-white/10"></div>

                                    <div className="mb-2 flex flex-wrap gap-2 items-center">
                                        <Component size={12} className="text-brand-lime/50" />
                                        {meta.category && (
                                            <span className="text-[10px] font-semibold text-brand-lime/80">
                                                {meta.category}
                                            </span>
                                        )}
                                        {meta.chunk_index !== undefined && (
                                            <span className="text-[10px] font-semibold bg-white/5 border border-white/10 px-1.5 rounded-sm text-brand-muted/70">
                                                Partie {meta.chunk_index}
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-[11.5px] leading-relaxed opacity-90 text-gray-300 bg-black/40 p-4 rounded-lg border border-white/5 overflow-y-auto overflow-x-auto max-h-[250px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {src.content.replace(/(\|\s*){3,}\|/g, ' | ... | ')}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SourceList;
