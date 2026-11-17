'use client';

import { cn } from '@/lib/utils';

interface ProjectPlaceholderProps {
    className?: string;
    title?: string;
}

export function getPlaceholderImageUrl(_title: string) {
    return '';
}

const PALETTES = [
    'from-emerald-500/20 via-teal-500/10 to-zinc-900',
    'from-blue-500/20 via-indigo-500/10 to-zinc-900',
    'from-purple-500/20 via-fuchsia-500/10 to-zinc-900',
    'from-amber-500/20 via-orange-500/10 to-zinc-900',
    'from-rose-500/20 via-pink-500/10 to-zinc-900',
];

function hashTitle(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

export function ProjectPlaceholder({ className, title = 'Project Preview' }: ProjectPlaceholderProps) {
    const palette = PALETTES[hashTitle(title) % PALETTES.length];
    const initials = title
        .split(/\s+/)
        .filter((w) => /^[A-Za-z0-9]/.test(w))
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

    return (
        <div
            className={cn(
                'relative w-full h-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 select-none',
                className
            )}
        >
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-80 dark:opacity-100', palette)} />
            <div
                className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(128,128,128,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.2) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />
            <div className="relative z-10 flex flex-col items-center text-center gap-3 max-w-[85%]">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.25em] bg-white/80 dark:bg-white/10 text-zinc-800 dark:text-white/80 border border-black/10 dark:border-white/15 backdrop-blur-sm">
                    {initials || 'PRJ'}
                </span>
                <p className="text-sm md:text-lg font-black tracking-tight text-zinc-900 dark:text-white line-clamp-2">
                    {title}
                </p>
            </div>
        </div>
    );
}
