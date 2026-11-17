'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, LayoutGroup, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Search, SortAsc, SortDesc, ExternalLink, X, Trophy, Medal, Award, ChevronRight, ChevronLeft, PanelLeftClose, PanelLeftOpen, LayoutGrid, List, ArrowUpRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { portfolioData } from '@/data/portfolio';
import { Achievement } from '@/types';
import dynamic from 'next/dynamic';

const FallingText = dynamic(() => import('@/components/effects/FallingText'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full animate-pulse bg-zinc-100/5 dark:bg-zinc-800/5 rounded-xl" />
});
import CertificateHeroScroll from '@/components/sections/CertificateHeroScroll';
import { usePerformance } from '@/hooks/usePerformance';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useLenis } from 'lenis/react';
import { DeferredMount } from '@/components/ui/DeferredMount';

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 }
};

const AchievementCard = React.memo(React.forwardRef<HTMLElement, {
    achievement: Achievement;
    onClick: () => void;
    index: number;
    isLowPowerMode?: boolean;
    viewMode?: 'grid' | 'list';
}>(
    ({ achievement, onClick, index, viewMode = 'grid' }, ref) => {
        const isAward = achievement.category.toLowerCase() === 'award';
        const formattedMonth = new Date(achievement.date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
        });

        const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        };

        if (viewMode === 'list') {
            return (
                <motion.article
                    ref={ref}
                    layout
                    role="button"
                    tabIndex={0}
                    onClick={onClick}
                    onKeyDown={handleKeyDown}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                        delay: Math.min(index * 0.02, 0.25),
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                        'group relative rounded-xl border p-5 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
                        isAward
                            ? 'bg-foreground/[0.025] dark:bg-foreground/[0.04] border-foreground/20 hover:border-foreground/45'
                            : 'bg-card border-border/80 hover:border-foreground/30'
                    )}
                >
                    <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="text-base sm:text-lg font-semibold tracking-[-0.02em] leading-snug text-foreground group-hover:text-foreground">
                            {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                            {achievement.issuer}
                        </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-x-5 gap-y-2 shrink-0 text-xs text-muted-foreground">
                        {achievement.credentialId && (
                            <span className="font-mono text-[11px] text-foreground/75 tabular-nums">
                                {achievement.credentialId}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
                            {isAward && <Trophy className="w-3.5 h-3.5 text-foreground/70" />}
                            {achievement.type || achievement.category}
                        </span>
                        <span className="tabular-nums">{formattedMonth}</span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                </motion.article>
            );
        }

        return (
            <motion.article
                ref={ref}
                layout
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={handleKeyDown}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                    default: { delay: Math.min(index * 0.03, 0.3), duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                }}
                whileHover={{ y: -2 }}
                className={cn(
                    'group relative rounded-xl border transition-colors duration-200 cursor-pointer flex flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isAward
                        ? 'bg-foreground/[0.025] dark:bg-foreground/[0.04] border-foreground/20 hover:border-foreground/45'
                        : 'bg-card border-border/80 hover:border-foreground/30'
                )}
            >
                {achievement.image && (
                    <div className="relative w-full aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted">
                        {achievement.image.endsWith('.pdf') ? (
                            <iframe
                                src={`${achievement.image}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full pointer-events-none border-0"
                                title={achievement.title}
                                loading="lazy"
                            />
                        ) : (
                            <img
                                src={achievement.image}
                                alt={achievement.title}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                                loading="lazy"
                            />
                        )}
                    </div>
                )}

                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        <h3 className="text-[17px] sm:text-lg font-semibold tracking-[-0.02em] leading-snug text-foreground line-clamp-2">
                            {achievement.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            {achievement.issuer}
                        </p>
                        {achievement.description && (
                            <p className="mt-3 text-sm text-muted-foreground/85 leading-relaxed line-clamp-2">
                                {achievement.description}
                            </p>
                        )}
                    </div>

                    <div className="pt-4 mt-5 border-t border-border/60 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 text-muted-foreground">
                            {isAward && <Trophy className="w-3.5 h-3.5 text-foreground shrink-0" />}
                            <span className="truncate font-medium text-foreground/80">
                                {achievement.type || achievement.category}
                            </span>
                            <span aria-hidden="true" className="text-border">·</span>
                            <span className="tabular-nums shrink-0">{formattedMonth}</span>
                            {achievement.credentialId && (
                                <>
                                    <span aria-hidden="true" className="text-border hidden sm:inline">·</span>
                                    <span className="font-mono text-[11px] text-muted-foreground truncate hidden sm:inline tabular-nums">
                                        {achievement.credentialId}
                                    </span>
                                </>
                            )}
                        </div>

                        <span className="inline-flex items-center gap-1 font-medium text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                            <span>Details</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                    </div>
                </div>
            </motion.article>
        );
    }
));
AchievementCard.displayName = 'AchievementCard';

const NavItem = React.memo(({ label, active, onClick, count, isCollapsed }: { label: string; active: boolean; onClick: () => void; count: number; isCollapsed: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ x: isCollapsed ? 0 : 6 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative w-full text-left transition-all duration-500 outline-none",
                active ? "bg-foreground/[0.03]" : "hover:bg-foreground/[0.015]",
                isCollapsed ? "py-8 px-0" : "py-5 lg:py-6 px-6 lg:px-8"
            )}
        >
            <div className={cn("flex items-center relative z-10 w-full", isCollapsed ? "justify-center" : "justify-between")}>
                <div className="flex items-center gap-3">
                    <motion.div
                        layout
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            "w-2 h-2 rounded-full transition-colors duration-300 relative shrink-0",
                            active
                                ? "bg-foreground scale-125 shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                        )}
                    />

                    <AnimatePresence initial={false}>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className={cn(
                                    "text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight whitespace-nowrap overflow-hidden block",
                                    active ? "text-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground/80 dark:text-muted-foreground/40 dark:group-hover:text-muted-foreground/60"
                                )}
                            >
                                {label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Hover Preview for Collapsed Sidebar */}
                <AnimatePresence>
                    {isCollapsed && isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: 10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 5, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="absolute left-[70%] ml-4 px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-2xl z-[100] whitespace-nowrap pointer-events-none"
                        >
                            <div className="flex items-center gap-2">
                                {label}
                                <span className="opacity-40 text-[8px]">{count.toString().padStart(2, '0')}</span>
                            </div>
                            {/* Arrow Tip */}
                            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                                "text-xs font-bold tabular-nums overflow-hidden block",
                                active ? "text-foreground/80" : "text-muted-foreground/15"
                            )}
                        >
                            {count.toString().padStart(2, '0')}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {active && (
                    <motion.div
                        layoutId="navActiveBar"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-foreground origin-center"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                )}
            </AnimatePresence>
        </motion.button>
    );
});

const AchievementModal = React.forwardRef<HTMLDivElement, {
    achievement: Achievement;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    currentIndex: number;
    totalCount?: number;
    isLowPowerMode?: boolean
}>(({
    achievement,
    onClose,
    onNext,
    onPrev,
    currentIndex,
    totalCount,
    isLowPowerMode
}, ref) => {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') onNext?.();
            if (e.key === 'ArrowLeft') onPrev?.();
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrev, onClose]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <motion.div
            ref={ref}
            id="achievement-modal-portal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            className={cn(
                "fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden",
                isLowPowerMode ? "bg-background/95" : "bg-background/75 backdrop-blur-md"
            )}
            onClick={() => onClose()}
        >
            <motion.div
                layoutId={`achievement-${achievement.id}`}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "w-full flex flex-col bg-card rounded-xl overflow-hidden border border-border shadow-2xl",
                    achievement.image ? "max-w-5xl" : "max-w-2xl"
                )}
            >
                {/* Archival Record Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 bg-muted/30">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                        <span className="font-mono font-medium text-foreground">
                            {(currentIndex + 1).toString().padStart(2, '0')} / {(totalCount || 0).toString().padStart(2, '0')}
                        </span>
                        <span aria-hidden="true" className="text-border">·</span>
                        <span>{achievement.type || achievement.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                            aria-label="Previous credential"
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                            aria-label="Next credential"
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            aria-label="Close credential details"
                            className="ml-1 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Archival Record Body */}
                <div className={cn(
                    "p-6 md:p-8 lg:p-10 overflow-auto max-h-[82vh]",
                    achievement.image ? "flex flex-col lg:flex-row gap-8 lg:gap-10" : "flex flex-col"
                )}>
                    {achievement.image && (
                        <div className="lg:w-[52%] flex items-center justify-center rounded-lg bg-muted/40 border border-border/60 p-2">
                            {achievement.image.endsWith('.pdf') ? (
                                <div className="w-full aspect-[1.4] relative rounded-md overflow-hidden bg-white">
                                    <iframe
                                        src={`${achievement.image}#toolbar=0&view=FitH`}
                                        className="w-full h-full border-0"
                                        title={achievement.title}
                                    />
                                </div>
                            ) : (
                                <img
                                    src={achievement.image}
                                    alt={achievement.title}
                                    className="w-full h-auto max-h-[55vh] object-contain rounded-md"
                                />
                            )}
                        </div>
                    )}

                    <div className={cn("flex flex-col justify-between gap-6", achievement.image ? "lg:w-[48%]" : "w-full")}>
                        <div className="space-y-5">
                            <div>
                                <h2
                                    id="achievement-modal-title"
                                    className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-[-0.025em]"
                                >
                                    {achievement.title}
                                </h2>
                                <p className="mt-2 text-base text-muted-foreground">
                                    {achievement.issuer}
                                </p>
                            </div>

                            {achievement.description && (
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[62ch]">
                                    {achievement.description}
                                </p>
                            )}

                            <dl className="divide-y divide-border/70 border-y border-border/70 text-sm">
                                <div className="py-3 flex items-center justify-between gap-4">
                                    <dt className="text-muted-foreground">Issued</dt>
                                    <dd className="font-medium text-foreground tabular-nums">{formatDate(achievement.date)}</dd>
                                </div>
                                <div className="py-3 flex items-center justify-between gap-4">
                                    <dt className="text-muted-foreground">Category</dt>
                                    <dd className="font-medium text-foreground capitalize">{achievement.type || achievement.category}</dd>
                                </div>
                                {achievement.credentialId && (
                                    <div className="py-3 flex items-center justify-between gap-4">
                                        <dt className="text-muted-foreground">Credential ID</dt>
                                        <dd className="font-mono text-xs text-foreground select-all tabular-nums">{achievement.credentialId}</dd>
                                    </div>
                                )}
                            </dl>

                            {achievement.tags && achievement.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {achievement.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {achievement.credentialUrl && (
                            <div className="pt-2 flex justify-end">
                                <a
                                    href={achievement.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-lg text-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <span>Verify Credential</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
});

export default function AchievementsPage() {
    const t = useTranslations('achievements');
    const { isLowPowerMode } = usePerformance();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const lenis = useLenis();

    const controlsRef = useRef<HTMLDivElement>(null);
    const isControlsInView = useInView(controlsRef, { margin: "0px" });

    const renderControls = (isSidebar: boolean = false) => {
        const isCompact = isSidebar && isSidebarCollapsed;

        return (
            <div className={cn("flex items-center gap-2", isCompact ? "flex-col w-full" : "w-full sm:w-auto")}>
                {/* Search */}
                <div className={cn("relative group/search", isCompact ? "w-10 h-10" : "flex-1 sm:min-w-[200px]")}>
                    {isCompact ? (
                        <>
                            {/* Collapsed Icon state */}
                            <div className="absolute inset-0 bg-white dark:bg-secondary/20 border border-zinc-200 dark:border-border/40 rounded-xl flex items-center justify-center text-muted-foreground transition-opacity z-10 pointer-events-none group-focus-within/search:opacity-0 group-hover/search:opacity-0 shadow-sm">
                                <Search className="w-4 h-4" />
                            </div>

                            {/* Expanding Input overlay */}
                            <div className="absolute left-0 top-0 h-10 w-10 group-hover/search:w-[250px] group-focus-within/search:w-[250px] transition-all duration-300 ease-out z-50 overflow-hidden bg-white dark:bg-secondary/20 border border-zinc-200 dark:border-border/40 focus-within:border-foreground/30 rounded-xl shadow-lg">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-foreground transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search archive..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full h-full bg-transparent pl-9 pr-8 text-sm outline-none placeholder:text-muted-foreground/40"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-secondary/20 border border-zinc-200 dark:border-border/40 focus:border-foreground/30 rounded-xl pl-10 pr-8 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground/40 shadow-sm focus:shadow-md"
                            />
                            {searchQuery && (
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </motion.button>
                            )}
                        </>
                    )}
                </div>

                {/* Sort */}
                <motion.button
                    onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "p-2.5 rounded-xl bg-white dark:bg-secondary/20 hover:bg-secondary/10 dark:hover:bg-secondary/40 border border-zinc-200 dark:border-border/40 text-muted-foreground hover:text-foreground transition-all shadow-sm hover:shadow-md",
                        isCompact ? "w-10 h-10 flex justify-center items-center" : ""
                    )}
                    title="Sort order"
                >
                    {sortOrder === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                </motion.button>

                {/* View Mode */}
                <div className={cn(
                    "flex bg-white dark:bg-secondary/20 rounded-xl border border-zinc-200 dark:border-border/40 p-1 shadow-sm",
                    isCompact ? "flex-col" : ""
                )}>
                    <motion.button
                        onClick={() => setViewMode('grid')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "p-1.5 rounded-lg transition-all",
                            viewMode === 'grid' ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/10 dark:hover:bg-secondary/40"
                        )}
                        title="Grid view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        onClick={() => setViewMode('list')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "p-1.5 rounded-lg transition-all",
                            viewMode === 'list' ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/10 dark:hover:bg-secondary/40"
                        )}
                        title="List view"
                    >
                        <List className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        );
    };

    // Centralized Scroll Lock - Optimized to ONLY fire on Open/Close
    useEffect(() => {
        const body = document.body;
        if (selectedAchievement) {
            if (lenis) lenis.stop();
            const isAlreadyLocked = body.getAttribute('data-modal-open') === 'true';
            if (!isAlreadyLocked) {
                const originalStyle = window.getComputedStyle(body).overflow;
                const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

                body.style.overflow = 'hidden';
                body.style.paddingRight = `${scrollBarWidth}px`;
                body.setAttribute('data-modal-open', 'true');
                body.setAttribute('data-original-overflow', originalStyle);
            }
        } else {
            if (lenis) lenis.start();
            const originalStyle = body.getAttribute('data-original-overflow') || '';
            body.style.overflow = originalStyle === 'hidden' ? '' : originalStyle;
            body.style.paddingRight = '0px';
            body.removeAttribute('data-modal-open');
            body.removeAttribute('data-original-overflow');
        }
    }, [!!selectedAchievement, lenis]); // Only fire when truthiness changes

    const stats = useMemo(() => {
        const total = portfolioData.achievements.length;
        const awards = portfolioData.achievements.filter(a => a.category.toLowerCase() === 'award').length;
        const certifications = portfolioData.achievements.filter(a => a.category.toLowerCase() === 'certification').length;
        const competitions = portfolioData.achievements.filter(a => a.category.toLowerCase() === 'competition').length;
        return { total, awards, certifications, competitions };
    }, []);

    const filteredAchievements = useMemo(() => {
        let achievements = [...portfolioData.achievements];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            achievements = achievements.filter((a) =>
                a.title.toLowerCase().includes(query) ||
                a.issuer.toLowerCase().includes(query) ||
                a.category.toLowerCase().includes(query)
            );
        }
        if (activeCategory !== 'all') {
            achievements = achievements.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());
        }
        achievements.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
        return achievements;
    }, [searchQuery, sortOrder, activeCategory]);

    // Navigation logic for modal (Stabilized with useCallback)
    const currentIndex = useMemo(() => {
        if (!selectedAchievement) return -1;
        return filteredAchievements.findIndex(a => a.id === selectedAchievement.id);
    }, [selectedAchievement, filteredAchievements]);

    const handleNext = useCallback(() => {
        if (!selectedAchievement) return;
        const currentIndex = filteredAchievements.findIndex(a => a.id === selectedAchievement.id);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % filteredAchievements.length;
        setSelectedAchievement(filteredAchievements[nextIndex]);
    }, [selectedAchievement, filteredAchievements]);

    const handlePrev = useCallback(() => {
        if (!selectedAchievement) return;
        const currentIndex = filteredAchievements.findIndex(a => a.id === selectedAchievement.id);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + filteredAchievements.length) % filteredAchievements.length;
        setSelectedAchievement(filteredAchievements[prevIndex]);
    }, [selectedAchievement, filteredAchievements]);

    const handleCloseModal = useCallback(() => {
        setSelectedAchievement(null);
    }, []);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isGridExpanded, setIsGridExpanded] = useState(false);

    useEffect(() => {
        if (isSidebarCollapsed) {
            const timer = setTimeout(() => setIsGridExpanded(true), 450); // Wait for sidebar to close before expanding grid
            return () => clearTimeout(timer);
        } else {
            setIsGridExpanded(false); // Instantly collapse grid when opening sidebar
        }
    }, [isSidebarCollapsed]);

    const getCategoryCount = (cat: string) => {
        if (cat === 'all') return portfolioData.achievements.length;
        return portfolioData.achievements.filter(a => a.category.toLowerCase() === cat.toLowerCase()).length;
    };

    return (

        <div className="min-h-screen bg-background text-foreground overflow-x-clip">
            {/* Hero Scroll Section */}
            <ErrorBoundary fallback={<div className="h-[60vh] flex items-center justify-center">Hero Unavailable</div>}>
                <CertificateHeroScroll isLowPowerMode={isLowPowerMode} />
            </ErrorBoundary>

            {/* Ambient Background layer */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    className={cn(
                        "absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-foreground/[0.02]",
                        isLowPowerMode ? "blur-xl" : "blur-3xl"
                    )}
                    animate={isLowPowerMode ? {} : { scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ willChange: "transform, opacity" }}
                />
                <motion.div
                    className={cn(
                        "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-foreground/[0.015]",
                        isLowPowerMode ? "blur-xl" : "blur-3xl"
                    )}
                    animate={isLowPowerMode ? {} : { scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                    style={{ willChange: "transform, opacity" }}
                />
            </div>

            {/* CONTINUOUS CURTAIN LAYER: Covers the fixed hero */}
            <DeferredMount>
                <div className="relative z-50 bg-background">

                {/* Main Two-Panel Layout */}
                <div className="flex flex-col lg:flex-row relative items-start">

                    {/* LEFT PANEL: Navigation - Sticky */}
                    <motion.div
                        initial={false}
                        animate={{
                            width: isSidebarCollapsed ? "80px" : "33.333333%",
                        }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            "w-full h-auto lg:h-screen lg:sticky lg:top-0 py-12 lg:py-4 xl:py-10 flex flex-col z-40 bg-background/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none border-r border-border/10",
                            isSidebarCollapsed && "items-center"
                        )}
                        style={{ willChange: "width" }}
                    >

                        {/* Header & Toggle */}
                        <div className={cn("px-6 lg:px-10 mb-10 w-full flex items-center justify-between order-1 shrink-0", isSidebarCollapsed && "px-0 justify-center")}>
                            {!isSidebarCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-foreground" />
                                        <h1 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                                            The Archive
                                        </h1>
                                    </div>
                                    <div className="h-1.5 w-20 bg-foreground opacity-100" />
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className={cn(
                                    "p-2.5 rounded-xl bg-foreground/10 hover:bg-foreground/20 text-foreground transition-all border border-foreground/10",
                                    isSidebarCollapsed && "mt-[-60px]"
                                )}
                            >
                                {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                            </motion.button>
                        </div>

                        {/* Navigation */}
                        <motion.nav
                            className="flex-1 w-full order-3"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div variants={staggerItem}>
                                <NavItem label="All Entries" active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} count={getCategoryCount('all')} isCollapsed={isSidebarCollapsed} />
                            </motion.div>
                            <motion.div variants={staggerItem}>
                                <NavItem label="Certifications" active={activeCategory === 'certification'} onClick={() => setActiveCategory('certification')} count={getCategoryCount('certification')} isCollapsed={isSidebarCollapsed} />
                            </motion.div>
                            <motion.div variants={staggerItem}>
                                <NavItem label="Awards" active={activeCategory === 'award'} onClick={() => setActiveCategory('award')} count={getCategoryCount('award')} isCollapsed={isSidebarCollapsed} />
                            </motion.div>
                            <motion.div variants={staggerItem}>
                                <NavItem label="Competitions" active={activeCategory === 'competition'} onClick={() => setActiveCategory('competition')} count={getCategoryCount('competition')} isCollapsed={isSidebarCollapsed} />
                            </motion.div>
                        </motion.nav>

                        {/* Moved Controls (when scrolled out of view) */}
                        <div className={cn("hidden lg:block w-full shrink-0", isSidebarCollapsed ? "order-4" : "order-2")}>
                            <AnimatePresence>
                                {!isControlsInView && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className={cn("w-full overflow-visible", isSidebarCollapsed ? "px-0 flex justify-center mb-8" : "px-6 lg:px-10 mb-8")}
                                    >
                                        {renderControls(true)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Large counter */}
                        {!isSidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="px-6 py-4 lg:px-10 lg:py-4 hidden lg:block order-5 shrink-0 group cursor-default"
                            >
                                <motion.div
                                    className="text-[9rem] font-black leading-none text-foreground/[0.18] dark:text-foreground/20 select-none transition-colors duration-500 group-hover:text-foreground/[0.35] dark:group-hover:text-foreground/40"
                                >
                                    {stats.total.toString().padStart(2, '0')}
                                </motion.div>
                                <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest flex items-center gap-2 -mt-4 transition-colors duration-500 group-hover:text-muted-foreground">
                                    <Award className="w-3 h-3" />
                                    Achievements
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* RIGHT PANEL: Cards - Natural Flow */}
                    <div className="flex-1 w-full flex flex-col pt-8 lg:pt-4 xl:pt-10 px-6 lg:px-10 pb-20 overflow-hidden">

                        {/* Controls */}
                        <motion.div
                            ref={controlsRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-8 shrink-0 z-30 sticky top-20 lg:static"
                        >
                            {/* Stats */}
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    { icon: Trophy, value: stats.total },
                                    { icon: Medal, value: stats.awards },
                                    { icon: Award, value: stats.certifications }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-secondary/20 text-xs font-bold"
                                    >
                                        <stat.icon className="w-3 h-3 text-muted-foreground" />
                                        <span>{stat.value}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Search & Filters */}
                            <div className="hidden lg:block opacity-100 transition-opacity duration-300">
                                {renderControls(false)}
                            </div>
                            <div className="block lg:hidden">
                                {renderControls(false)}
                            </div>
                        </motion.div>

                        <LayoutGroup id="achievements-gallery">
                            <motion.div
                                className={cn(
                                    "grid gap-5",
                                    viewMode === 'list'
                                        ? (isGridExpanded ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1")
                                        : isGridExpanded
                                            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
                                            : "grid-cols-1 md:grid-cols-2"
                                )}
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredAchievements.length > 0 ? (
                                        filteredAchievements.map((achievement, index) => (
                                            <AchievementCard
                                                key={achievement.id}
                                                achievement={achievement}
                                                onClick={() => setSelectedAchievement(achievement)}
                                                index={index}
                                                isLowPowerMode={isLowPowerMode}
                                                viewMode={viewMode}
                                            />
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 rounded-xl border border-dashed border-border bg-card/50"
                                        >
                                            <div className="p-4 rounded-full bg-muted">
                                                <Search className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-semibold text-foreground tracking-tight">No matching entries</h3>
                                                <p className="text-sm text-muted-foreground">Try adjusting your search query or switching category filters.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                                className="px-5 py-2 rounded-lg bg-foreground text-background font-medium text-xs transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                Reset filters
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </LayoutGroup>
                    </div>
                </div>

                {/* FALLING TEXT SECTION - Below contents */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="w-full py-24 border-t border-border/20"
                >
                    <div className="max-w-5xl mx-auto px-6">
                        {/* Section header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3">
                                Technical Universe
                            </h2>
                            <p className="text-sm text-muted-foreground/60 max-w-lg mx-auto leading-relaxed">
                                Interact with the core technologies and values that drive my research and development journey.
                            </p>
                        </motion.div>

                        {/* Falling text container */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative w-full mx-auto h-[400px]"
                        >
                            <ErrorBoundary fallback={<div className="text-center opacity-50">Visuals Unavailable</div>}>
                                <FallingText
                                    text="Python SQL TensorFlow Keras IndoBERT LookerStudio PowerBI Flask PHP Laravel MySQL Pentaho OLAP Kotlin Odoo"
                                    highlightWords={['Python', 'TensorFlow', 'IndoBERT', 'LookerStudio', 'SQL']}
                                    trigger="scroll"
                                    gravity={0.8}
                                    mouseConstraintStiffness={0.2}
                                    fontSize="1.5rem"
                                    fontWeight="900"
                                    force={true}
                                />
                            </ErrorBoundary>
                        </motion.div>
                    </div>
                </motion.section>
            </div>
            </DeferredMount>

            {/* Modal */}
            <AnimatePresence>
                {selectedAchievement && (
                    <AchievementModal
                        achievement={selectedAchievement}
                        onClose={handleCloseModal}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        currentIndex={currentIndex}
                        totalCount={filteredAchievements.length}
                        isLowPowerMode={isLowPowerMode}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
