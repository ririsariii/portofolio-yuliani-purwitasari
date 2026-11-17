'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { Copy, Linkedin, Github, Link as LinkIcon, ArrowLeft, Check, Instagram, BookOpen } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TocItem {
    id: string;
    label: string;
}

interface RelatedResource {
    title: string;
    time: string;
    image: string;
    category: string;
    url: string;
}

const ARTICLE_TOC: Record<string, TocItem[]> = {
    'indobert-aspect-based-sentiment-analysis': [
        { id: 'overview', label: 'Why Aspect-Based NLP?' },
        { id: 'pipeline', label: 'IndoBERT Pipeline' },
        { id: 'impact', label: 'Actionable Insights' },
    ],
    'building-realtime-bi-dashboards-looker-studio': [
        { id: 'kpis', label: 'Defining Clear KPIs' },
        { id: 'modeling', label: 'ETL & OLAP Foundations' },
        { id: 'delivery', label: 'Operational Impact' },
    ],
    'bangkit-capstone-tanamore-journey': [
        { id: 'vision', label: 'The Agricultural Challenge' },
        { id: 'architecture', label: '97% CNN Pipeline' },
        { id: 'teamwork', label: 'Top 50 Execution' },
    ],
};

const RELATED_RESOURCES: Record<string, RelatedResource[]> = {
    'indobert-aspect-based-sentiment-analysis': [
        {
            title: 'PLN Mobile Reviews ABSA Project',
            time: 'Case Study',
            image: '/project/aspectbasedsentimentanalysisplnmobileappreviews1.webp',
            category: 'Thesis NLP',
            url: '/projects/absa-pln-mobile',
        },
        {
            title: 'East Java Tourism ABSA Dashboard',
            time: 'Dashboard',
            image: '/project/eastjavatourismabsadashboard1.webp',
            category: 'Analytics',
            url: '/projects/east-java-tourism-absa',
        },
    ],
    'building-realtime-bi-dashboards-looker-studio': [
        {
            title: 'PT PLN (Persero) UP3 Gresik Internship',
            time: 'Experience',
            image: '/gallery/pln-internship.webp',
            category: 'BI & Ops',
            url: '/experience',
        },
        {
            title: 'East Java Tourism ABSA Dashboard',
            time: 'Dashboard',
            image: '/project/eastjavatourismabsadashboard2.webp',
            category: 'Looker Studio',
            url: '/projects/east-java-tourism-absa',
        },
    ],
    'bangkit-capstone-tanamore-journey': [
        {
            title: 'Bangkit Academy Machine Learning',
            time: 'Program',
            image: '/gallery/bangkit-academy.webp',
            category: 'Google Bangkit',
            url: '/experience',
        },
        {
            title: 'Tanamore Capstone Showcase',
            time: 'Project',
            image: '/gallery/tanamore-capstone.webp',
            category: 'Top 50',
            url: '/projects/tanamore-plant-disease',
        },
    ],
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const t = useTranslations('blog');
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 2) {
            router.back();
        } else {
            router.push('/blog');
        }
    };

    const post = portfolioData.blogs.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const tocItems = ARTICLE_TOC[slug] ?? [
        { id: 'overview', label: 'Overview' },
    ];
    const resources = RELATED_RESOURCES[slug] ?? [];

    return (
        <main className="min-h-screen bg-background pb-24 pt-32">
            {/* Header Section */}
            <div className="container max-w-7xl mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium hover:text-primary transition-colors">
                            <button onClick={handleBack} className="flex items-center gap-2 focus:outline-none">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>
                        </div>
                    </div>

                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
                            {post.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                            {post.excerpt}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Hero Image */}
            <div className="container max-w-7xl mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative w-full aspect-[21/9] md:aspect-[2/1] rounded-3xl overflow-hidden border border-border/40 shadow-2xl"
                >
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>
            </div>

            {/* Metadata Bar */}
            <div className="container max-w-7xl mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row items-center justify-between border-y border-border/40 py-6 gap-6">
                    <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-start">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Written by</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">{post.author.name}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Published on</span>
                            <span className="font-bold text-foreground">{post.date}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={handleCopy}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 transition-all text-xs font-bold uppercase tracking-wider rounded-lg',
                                copied
                                    ? 'bg-primary text-background'
                                    : 'bg-secondary/10 hover:bg-secondary/20 text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" /> <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Copy link</span>
                                </>
                            )}
                        </button>
                        <div className="w-px h-6 bg-border/40 hidden sm:block" />
                        <Link href="https://linkedin.com/in/yuliani-purwitasari" target="_blank" className="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/10 rounded-lg hover:bg-primary/10">
                            <Linkedin className="w-4 h-4" />
                        </Link>
                        <Link href="https://github.com/ririsariii" target="_blank" className="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/10 rounded-lg hover:bg-primary/10">
                            <Github className="w-4 h-4" />
                        </Link>
                        <Link href="https://instagram.com/ririsariii" target="_blank" className="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/10 rounded-lg hover:bg-primary/10">
                            <Instagram className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar Grid */}
            <div className="container max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Article Content */}
                    <div className="lg:col-span-8">
                        <div className="prose prose-lg dark:prose-invert prose-primary max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-loose prose-p:text-muted-foreground">
                            {slug === 'indobert-aspect-based-sentiment-analysis' ? (
                                <>
                                    <h2 id="overview" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Why Aspect-Based NLP Matters</h2>
                                    <p className="mb-8">
                                        Document-level sentiment scores collapse rich user feedback into a single label—missing the nuance when a customer praises fast meter recording while criticizing payment gateway downtime. In both my undergraduate thesis on <strong>PLN Mobile reviews</strong> and our <strong>East Java Tourism ABSA system</strong> (±35,000 Google Maps reviews), separating aspect extraction from sentiment classification proved essential.
                                    </p>

                                    <div className="my-10 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="/project/eastjavatourismabsadashboard2.webp"
                                            alt="East Java Tourism ABSA Dashboard"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    </div>

                                    <h2 id="pipeline" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Designing the IndoBERT Multi-Task Pipeline</h2>
                                    <p className="mb-6">
                                        Indonesian app and tourism reviews mix formal vocabulary with regional slang, abbreviations, and code-switching. Our preprocessing and modeling workflow combined:
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 space-y-2 text-muted-foreground">
                                        <li><strong>Text Normalization:</strong> Colloquial slang mapping, emoji handling, and domain-specific noise filtering while preserving negation cues.</li>
                                        <li><strong>Topic & Aspect Discovery:</strong> Topic modeling alongside predefined service dimensions (usability, reliability, facilities, pricing, customer support).</li>
                                        <li><strong>IndoBERT Fine-Tuning:</strong> Transformer sequence classification tuned with stratified class weights to handle imbalanced aspect labels.</li>
                                    </ul>

                                    <blockquote className="border-l-4 border-primary pl-6 my-10 italic text-xl font-medium text-foreground">
                                        &ldquo;Granular sentiment only creates impact when product and operations teams can slice every complaint back to a concrete service dimension.&rdquo;
                                        <footer className="mt-4 text-sm font-bold not-italic text-primary flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden relative">
                                                <Image src={post.author.avatar} alt={post.author.name} fill sizes="32px" loading="lazy" className="object-cover object-[50%_20%]" />
                                            </div>
                                            <div>
                                                <div className="text-foreground">{post.author.name}</div>
                                                <div className="text-muted-foreground text-xs font-normal">Data Scientist & NLP Researcher</div>
                                            </div>
                                        </footer>
                                    </blockquote>

                                    <h2 id="impact" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">From Predictions to Interactive Dashboards</h2>
                                    <p className="mb-8">
                                        Deploying the trained model behind interactive BI views allowed non-technical stakeholders to filter sentiment trends by province, app version, and aspect category—turning raw review text into clear prioritization roadmaps.
                                    </p>
                                </>
                            ) : slug === 'building-realtime-bi-dashboards-looker-studio' ? (
                                <>
                                    <h2 id="kpis" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Starting with Clear Operational KPIs</h2>
                                    <p className="mb-8">
                                        During my internship at <strong>PT PLN (Persero) UP3 Gresik</strong>, reporting workflows initially required repetitive manual spreadsheet consolidation across service units. Before opening Looker Studio or Power BI, the critical step was aligning with division leads on which operational metrics actually drove daily decisions.
                                    </p>

                                    <div className="my-10 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="/gallery/pln-internship.webp"
                                            alt="PT PLN (Persero) UP3 Gresik BI & Web Work"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    </div>

                                    <h2 id="modeling" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Clean ETL & OLAP Foundations</h2>
                                    <p className="mb-6">
                                        Whether working on utility operations at PLN or building an <strong>AdventureWorks OLAP cube</strong> with star-schema dimensions, visual clarity depends on clean upstream modeling:
                                    </p>
                                    <ul className="list-disc pl-6 mb-8 space-y-2 text-muted-foreground">
                                        <li><strong>Standardized Schemas:</strong> Consistent date dimensions, unit identifiers, and validated numeric types before connecting BI connectors.</li>
                                        <li><strong>Drill-Down Hierarchy:</strong> Executive summary scorecards on top, followed by sliceable regional/time-series breakdowns.</li>
                                        <li><strong>Performance Guardrails:</strong> Pre-aggregated tables and clean calculated fields to keep filter interactions snappy.</li>
                                    </ul>

                                    <h2 id="delivery" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Bridging Analytics & Web Workflows</h2>
                                    <p className="mb-8">
                                        Pairing Looker Studio monitoring with custom PHP/Laravel and JavaScript internal portals eliminated duplicate entry and gave teams a single source of truth for progress tracking.
                                    </p>
                                </>
                            ) : slug === 'bangkit-capstone-tanamore-journey' ? (
                                <>
                                    <h2 id="vision" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Addressing Plant Disease Early Detection</h2>
                                    <p className="mb-8">
                                        At <strong>Bangkit Academy 2024 Batch 2</strong> (led by Google, GoTo, and Traveloka), our cross-disciplinary team built <strong>Tanamore</strong>—an AI-assisted agricultural application designed to help farmers identify plant leaf diseases rapidly using mobile photography.
                                    </p>

                                    <div className="my-10 relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 bg-secondary/5">
                                        <Image
                                            src="/gallery/tanamore-capstone.webp"
                                            alt="Tanamore Capstone Team"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            loading="lazy"
                                            className="object-cover"
                                        />
                                    </div>

                                    <h2 id="architecture" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Reaching 97% Validation Accuracy with CNNs</h2>
                                    <ul className="list-disc pl-6 mb-8 space-y-2 text-muted-foreground">
                                        <li><strong>Dataset Curation & Augmentation:</strong> Balanced multi-class leaf imagery with controlled rotation, brightness, and zoom augmentation to generalize across field lighting.</li>
                                        <li><strong>Transfer Learning & Fine-Tuning:</strong> Evaluated convolutional backbones in TensorFlow/Keras until reaching 97% accuracy while keeping model size lean for cloud inference.</li>
                                        <li><strong>API Integration:</strong> Exported SavedModel weights and coordinated closely with Cloud Computing (Google Cloud) and Mobile Development (Kotlin) teammates.</li>
                                    </ul>

                                    <h2 id="teamwork" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">Lessons from Leading a Top 50 Product Capstone</h2>
                                    <p className="mb-8">
                                        Out of 672 capstone projects nationwide, Tanamore was selected among the <strong>Top 50 Product-Based Capstones</strong>, alongside earning Distinction &amp; Best Graduate honors in the Machine Learning path (Score 96.8, Top 10%). Clear milestone planning and cross-path empathy made every integration sprint count.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 id="overview" className="text-3xl font-bold mb-6 text-foreground scroll-mt-32">{post.title}</h2>
                                    <p className="mb-8">{post.content}</p>
                                </>
                            )}

                            <div className="mt-12 pt-12 border-t border-border/40">
                                <h3 className="text-lg font-bold mb-6">Related Topics</h3>
                                <div className="flex flex-wrap gap-3">
                                    {post.tags.map((tag) => (
                                        <Link key={tag} href={`/blog?q=${tag}`} className="px-4 py-2 bg-secondary/10 hover:bg-primary/10 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20 rounded-lg text-sm transition-all font-medium">
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-12 space-y-8">
                            {/* Table of Contents */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border/40">
                                    Table of Contents
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {tocItems.map((item, index) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={`group flex items-center gap-3 text-sm font-medium transition-colors ${
                                                index === 0 ? 'text-primary pl-0' : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <span className={`h-px w-4 transition-all ${index === 0 ? 'bg-primary' : 'bg-transparent group-hover:bg-border'}`} />
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Related Resources */}
                            {resources.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border/40">
                                        Related Work
                                    </h3>
                                    <ul className="space-y-6">
                                        {resources.map((resource, i) => (
                                            <li key={i} className="group">
                                                <Link href={resource.url} className="flex gap-4 items-start">
                                                    <div className="relative w-24 aspect-[3/2] rounded-lg overflow-hidden flex-shrink-0 bg-secondary/10 border border-border/40">
                                                        <Image
                                                            src={resource.image}
                                                            alt={resource.title}
                                                            fill
                                                            sizes="96px"
                                                            loading="lazy"
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                                            <LinkIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 pt-0.5">
                                                        <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded w-fit">
                                                            {resource.category}
                                                        </span>
                                                        <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                            {resource.title}
                                                        </h5>
                                                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                                            <BookOpen className="w-3 h-3" />
                                                            {resource.time}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Tags / Topics */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border/40">
                                    Topics
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/blog?q=${tag}`}
                                            className="px-3 py-1.5 bg-secondary/5 hover:bg-primary/10 text-xs font-medium text-muted-foreground hover:text-primary border border-border/40 hover:border-primary/20 rounded-md transition-all"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest From Blog Section */}
            <div className="container max-w-7xl mx-auto px-6 mt-16 border-t border-border/40 pt-16">
                <div className="flex items-center justify-between mb-12">
                    <h3 className="text-2xl font-black tracking-tight">From the blog</h3>
                    <Link href="/blog" className="px-6 py-2 rounded-lg bg-secondary/10 border border-border/40 text-sm font-bold hover:bg-secondary/20 transition-all">
                        View all posts
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioData.blogs.filter((b) => b.slug !== slug).slice(0, 2).map((b) => (
                        <Link key={b.slug} href={`/blog/${b.slug}`} className="group block">
                            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-secondary/5 border border-border/40">
                                <Image src={b.image} alt={b.title} fill sizes="(max-width: 768px) 100vw, 500px" loading="lazy" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                        {t(`categories.${b.category}`)}
                                    </span>
                                </div>
                            </div>
                            <h4 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors flex items-center gap-2">
                                {b.title}
                            </h4>
                            <p className="text-muted-foreground line-clamp-2 mb-4">{b.excerpt}</p>
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <div className="w-6 h-6 rounded-full bg-secondary/20 relative overflow-hidden">
                                    <Image src={b.author.avatar} alt={b.author.name} loading="lazy" fill sizes="32px" className="object-cover object-[50%_20%]" />
                                </div>
                                {b.author.name} · {b.date}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
