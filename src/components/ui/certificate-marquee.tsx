"use client";

import { motion, MotionValue, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import { Achievement } from "@/types";

const featuredCredentials: Achievement[] = portfolioData.achievements.slice(0, 12);

function ScrambleButton({ href }: { href: string }) {
  const [displayText, setDisplayText] = useState("View All Achievements");
  const [isScrambling, setIsScrambling] = useState(false);
  const originalText = "View All Achievements";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = originalText.length;

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  };

  return (
    <Link
      href={href}
      onMouseEnter={scramble}
      className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/20"
    >
      <span className="relative z-10">{displayText}</span>
      <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:animate-[move-x_1.5s_infinite]" />
    </Link>
  );
}

type ColumnProps = {
  items: Achievement[];
  y: MotionValue<number>;
};

const Column = ({ items, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/3 min-w-[250px] flex-col gap-4 md:gap-6 first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-65%] will-change-transform"
      style={{ y, translateZ: 0 }}
    >
      {items.map((item, i) => (
        <div
          key={`${item.id}-${i}`}
          className={`relative w-full overflow-hidden rounded-xl border p-6 md:p-8 flex flex-col justify-between min-h-[210px] md:min-h-[240px] ${
            item.category === "award"
              ? "bg-foreground/[0.03] dark:bg-foreground/[0.04] border-foreground/20"
              : "bg-card border-border/80"
          }`}
        >
          <div className="space-y-2">
            <h4 className="text-base md:text-xl font-semibold tracking-[-0.02em] leading-snug text-foreground line-clamp-3">
              {item.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {item.issuer}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground pt-4 mt-6 border-t border-border/60 tabular-nums">
            <span className="font-mono truncate">
              {item.credentialId ? item.credentialId : item.type || item.category}
            </span>
            <span className="font-medium text-foreground/80 shrink-0">
              {new Date(item.date).getFullYear()}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export function CertificateShowcase() {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 20,
    damping: 15,
    mass: 0.2,
    restDelta: 0.001,
  });

  const { height } = dimension;
  const y = useTransform(smoothProgress, [0, 1], [0, height * 1.2]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, height * 2.0]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, height * 0.8]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const col1 = [featuredCredentials[0], featuredCredentials[1], featuredCredentials[2], featuredCredentials[3], featuredCredentials[4], featuredCredentials[5]];
  const col2 = [featuredCredentials[6], featuredCredentials[7], featuredCredentials[8], featuredCredentials[9], featuredCredentials[10], featuredCredentials[11]];
  const col3 = [featuredCredentials[3], featuredCredentials[0], featuredCredentials[8], featuredCredentials[1], featuredCredentials[10], featuredCredentials[4]];

  return (
    <section className="relative w-full bg-background overflow-hidden pb-32">
      {/* Intro Text Section */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 max-w-[1750px] mb-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center justify-center gap-8 w-full"
        >
          <div className="space-y-6 w-full">
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.2em] text-primary/60 uppercase">
                Certifications &amp; Achievements
              </h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight max-w-none text-foreground">
                Validating <span className="text-shiny">Excellence</span> through Global Standards.
              </h3>
              <p className="text-lg text-muted-foreground max-w-none leading-relaxed lg:whitespace-nowrap">
                32+ verified credentials from BNSP, Google, DeepLearning.AI, Dicoding, and RevoU alongside 3 academic &amp; Bangkit honors.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <ScrambleButton href="/achievements" />
          </div>
        </motion.div>
      </div>

      {/* Parallax Gallery */}
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        <div
          ref={gallery}
          className="relative box-border flex h-[100vh] md:h-[130vh] gap-4 md:gap-6 overflow-hidden rounded-none"
        >
          <Column items={col1} y={y} />
          <Column items={col2} y={y2} />
          <Column items={col3} y={y3} />
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-[20%] left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </section>
  );
}
