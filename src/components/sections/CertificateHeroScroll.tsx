"use client";

import { useEffect, useRef, useCallback, type FC, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformance } from "@/hooks/usePerformance";
import { ChevronDown, Award, ShieldCheck } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { Achievement } from "@/types";

interface Position {
    top: number;
    left: number;
    width: number;
    height: number;
    borderRadius: number;
    zIndex?: number;
}

interface Positions {
    initial: Record<string, Position>;
    final: Record<string, Position>;
}

interface CertificateHeroScrollProps {
    onDownloadClick?: () => void;
    isLowPowerMode?: boolean;
}

const FEATURED_ITEMS: Achievement[] = [
    portfolioData.achievements[0], // 3rd Best Graduate UPNVJT
    portfolioData.achievements[1], // Bangkit Distinction & Best Graduate
    portfolioData.achievements[2], // Top 50 Capstone Tanamore
    portfolioData.achievements[3], // BNSP Junior Web Programmer
    portfolioData.achievements[15], // DeepLearning.AI TensorFlow Specialization
    portfolioData.achievements[25], // Dicoding Analisis Data Python
].filter(Boolean);

const CertificateHeroScroll: FC<CertificateHeroScrollProps> = ({ isLowPowerMode: isLowPowerModeProp }) => {
    const spacerRef = useRef<HTMLDivElement>(null);
    const fixedContainerRef = useRef<HTMLDivElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { isLowPowerMode: performanceLowPower } = usePerformance();
    const isLowPowerMode = isLowPowerModeProp ?? performanceLowPower;

    const [items] = useState<Achievement[]>(FEATURED_ITEMS);

    const getPositions = useCallback((): Positions => {
        const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
        const vh = typeof window !== "undefined" ? window.innerHeight : 1080;
        const isCurrentlyMobile = vw < 768;

        const desktopInitial: Record<string, Position> = {
            cert1: { top: vh * 0.15, left: vw * 0.05, width: vw * 0.22, height: vh * 0.22, borderRadius: 12, zIndex: 1 },
            cert2: { top: vh * 0.12, left: vw * 0.38, width: vw * 0.2, height: vh * 0.2, borderRadius: 12, zIndex: 1 },
            cert3: { top: vh * 0.18, left: vw * 0.72, width: vw * 0.22, height: vh * 0.22, borderRadius: 12, zIndex: 1 },
            cert4: { top: vh * 0.70, left: vw * 0.08, width: vw * 0.2, height: vh * 0.25, borderRadius: 12, zIndex: 1 },
            cert5: { top: vh * 0.75, left: vw * 0.42, width: vw * 0.2, height: vh * 0.18, borderRadius: 12, zIndex: 1 },
            cert6: { top: vh * 0.65, left: vw * 0.75, width: vw * 0.18, height: vh * 0.25, borderRadius: 12, zIndex: 1 },
        };

        const mGap = 10;
        const mGridW = vw * 0.9;
        const mColW = (mGridW - mGap) / 2;
        const fixedHeight = 160;

        const mobileInitial: Record<string, Position> = {
            cert1: { top: vh * 0.15, left: vw * 0.05, width: mColW, height: fixedHeight, borderRadius: 8, zIndex: 1 },
            cert2: { top: vh * 0.12, left: vw * 0.52, width: mColW, height: fixedHeight, borderRadius: 8, zIndex: 1 },
            cert3: { top: vh * 0.35, left: vw * 0.08, width: mColW, height: fixedHeight, borderRadius: 8, zIndex: 1 },
            cert4: { top: vh * 0.60, left: vw * 0.10, width: mColW, height: fixedHeight, borderRadius: 8, zIndex: 1 },
            cert5: { top: vh * 0.65, left: vw * 0.55, width: mColW, height: fixedHeight, borderRadius: 8, zIndex: 1 },
            cert6: { top: vh * 0.40, left: vw * 0.50, width: mColW, height: fixedHeight, borderRadius: 8, zIndex: 1 },
        };

        const initial = isCurrentlyMobile ? mobileInitial : desktopInitial;

        const gridW = Math.min(vw * 0.85, 1400);
        const gridH = vh * 0.7;
        const startX = (vw - gridW) / 2;
        const startY = (vh - gridH) / 2 + (vh * 0.05);
        const gap = 16;
        const col1W = (gridW - 2 * gap) * 0.4;
        const col2W = (gridW - 2 * gap) * 0.3;
        const col3W = (gridW - 2 * gap) * 0.3;

        const desktopFinal: Record<string, Position> = {
            cert1: { top: startY, left: startX, width: col1W, height: (gridH - gap) * 0.55, borderRadius: 8, zIndex: 10 },
            cert2: { top: startY + (gridH - gap) * 0.55 + gap, left: startX, width: col1W, height: (gridH - gap) * 0.45, borderRadius: 8, zIndex: 10 },
            cert3: { top: startY, left: startX + col1W + gap, width: col2W, height: (gridH - gap) * 0.4, borderRadius: 8, zIndex: 10 },
            cert4: { top: startY + (gridH - gap) * 0.4 + gap, left: startX + col1W + gap, width: col2W, height: (gridH - gap) * 0.6, borderRadius: 8, zIndex: 10 },
            cert5: { top: startY, left: startX + col1W + col2W + 2 * gap, width: col3W, height: (gridH - gap) * 0.65, borderRadius: 8, zIndex: 10 },
            cert6: { top: startY + (gridH - gap) * 0.65 + gap, left: startX + col1W + col2W + 2 * gap, width: col3W, height: (gridH - gap) * 0.35, borderRadius: 8, zIndex: 10 },
        };

        const mStartX = (vw - mGridW) / 2;
        const mStartY = vh * 0.2;

        const mobileFinal: Record<string, Position> = {
            cert1: { top: mStartY, left: mStartX, width: mColW, height: 160, borderRadius: 8, zIndex: 10 },
            cert2: { top: mStartY, left: mStartX + mColW + mGap, width: mColW, height: 160, borderRadius: 8, zIndex: 10 },
            cert3: { top: mStartY + 170, left: mStartX, width: mColW, height: 160, borderRadius: 8, zIndex: 10 },
            cert4: { top: mStartY + 170, left: mStartX + mColW + mGap, width: mColW, height: 160, borderRadius: 8, zIndex: 10 },
            cert5: { top: mStartY + 340, left: mStartX, width: mColW, height: 160, borderRadius: 8, zIndex: 10 },
            cert6: { top: mStartY + 340, left: mStartX + mColW + mGap, width: mColW, height: 160, borderRadius: 8, zIndex: 10 },
        };

        const final = isCurrentlyMobile ? mobileFinal : desktopFinal;

        return { initial, final };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || items.length === 0) return;

        gsap.registerPlugin(ScrollTrigger);

        const { initial, final } = getPositions();
        const imageElements = imageRefs.current.filter((el): el is HTMLDivElement => el !== null);

        const ctx = gsap.context(() => {
            imageElements.forEach((img, index) => {
                const pos = initial[`cert${index + 1}`];
                if (pos) {
                    gsap.set(img, {
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                        borderRadius: pos.borderRadius,
                        zIndex: pos.zIndex,
                        scale: 0.8,
                        rotate: index % 2 === 0 ? -5 : 5,
                        opacity: 0,
                    });
                }
            });

            gsap.to(imageElements, {
                opacity: 0.85,
                scale: 1,
                duration: isLowPowerMode ? 0.6 : 1.2,
                stagger: isLowPowerMode ? 0.05 : 0.1,
                ease: "power2.out",
            });

            const mainTL = gsap.timeline({
                scrollTrigger: {
                    trigger: spacerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: isLowPowerMode ? 0.2 : 0.5,
                },
            });

            if (heroContentRef.current) {
                mainTL.to(heroContentRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.2 }, 0);
            }

            imageElements.forEach((img, index) => {
                const finalPos = final[`cert${index + 1}`];
                const initialPos = initial[`cert${index + 1}`];

                if (finalPos && initialPos) {
                    mainTL.fromTo(
                        img,
                        {
                            top: initialPos.top,
                            left: initialPos.left,
                            width: initialPos.width,
                            height: initialPos.height,
                            borderRadius: initialPos.borderRadius,
                            rotate: index % 2 === 0 ? -5 : 5,
                            opacity: 0.85,
                            scale: 1,
                            zIndex: initialPos.zIndex,
                        },
                        {
                            top: finalPos.top,
                            left: finalPos.left,
                            width: finalPos.width,
                            height: finalPos.height,
                            borderRadius: finalPos.borderRadius,
                            opacity: 1,
                            rotate: 0,
                            scale: 1,
                            zIndex: finalPos.zIndex,
                            duration: 1,
                            ease: "power2.inOut",
                            immediateRender: false,
                        },
                        0
                    );
                }
            });

            mainTL.to({}, { duration: 1.0 });
        }, spacerRef);

        ScrollTrigger.create({
            trigger: spacerRef.current,
            start: "bottom top",
            onEnter: () => {
                if (fixedContainerRef.current) gsap.to(fixedContainerRef.current, { autoAlpha: 0, duration: 0.5 });
            },
            onLeaveBack: () => {
                if (fixedContainerRef.current) gsap.to(fixedContainerRef.current, { autoAlpha: 1, duration: 0.5 });
            },
            toggleActions: "play none none reverse",
        });

        return () => ctx.revert();
    }, [getPositions, items, isLowPowerMode]);

    return (
        <>
            <div ref={spacerRef} className="h-[350vh] w-full relative z-10 pointer-events-none" />

            <div ref={fixedContainerRef} className="fixed inset-0 z-10 h-screen w-full overflow-hidden bg-transparent pointer-events-none">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-primary/10 blur-[80px] rounded-full" />
                    <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-secondary/10 blur-[80px] rounded-full" />
                </div>

                <div
                    ref={heroContentRef}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-50 pt-10 pb-32"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] mb-6 text-foreground animate-fade-in-up">
                        Certificates<br />&amp; Awards
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-150">
                        Academic distinctions, Bangkit Academy honors, and 32+ industry certifications across data science, machine learning, and web engineering.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'smooth' })}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group animate-fade-in-up delay-300 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
                    >
                        <span>Scroll to explore archive</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    </button>
                </div>

                {items.map((cert, index) => (
                    <div
                        key={cert.id}
                        ref={(el) => {
                            imageRefs.current[index] = el;
                        }}
                        className="absolute w-[10px] h-[10px] opacity-0 overflow-hidden bg-card border border-border/80 shadow-xl p-5 md:p-6 flex flex-col justify-between"
                        style={{
                            willChange: "transform, opacity",
                            zIndex: 1,
                        }}
                    >
                        <div className="space-y-1.5">
                            <h3 className="text-xs md:text-base font-semibold tracking-[-0.02em] leading-snug text-foreground line-clamp-3">
                                {cert.title}
                            </h3>
                            <p className="text-[11px] md:text-xs text-muted-foreground truncate">
                                {cert.issuer.split("·")[0].trim()}
                            </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-[10px] md:text-xs text-muted-foreground pt-3 border-t border-border/60 tabular-nums">
                            <span className="font-mono truncate">
                                {cert.credentialId || cert.type || cert.category}
                            </span>
                            <span className="font-medium text-foreground/80 shrink-0">
                                {new Date(cert.date).getFullYear()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CertificateHeroScroll;
