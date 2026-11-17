'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Mail, Github, Linkedin, Award, GraduationCap, Briefcase, Code2 } from 'lucide-react';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';

export default function ResumePage() {
    const { personal, education, experiences, projects, achievements, hardSkills, softSkills, tools } = portfolioData;

    const workAndBootcamp = experiences.filter((e) => e.id.startsWith('prof-') || e.id.startsWith('cert-'));
    const orgAndCommittee = experiences.filter((e) => e.id.startsWith('lead-'));
    const awards = achievements.filter((a) => a.category === 'award');
    const certCount = achievements.filter((a) => a.category === 'certification').length;

    return (
        <div className="min-h-screen bg-background relative pt-24 pb-16 print:pt-4 print:pb-4">
            {/* Header / Controls */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="container-creative px-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden"
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Portfolio</span>
                </Link>

                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all active:scale-95 shadow-sm"
                >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save as PDF</span>
                </button>
            </motion.div>

            {/* Structured CV Sheet */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-4xl mx-auto px-6 print:px-0"
            >
                <div className="bg-card border border-border/60 rounded-3xl p-8 md:p-12 shadow-xl space-y-10 print:border-0 print:shadow-none print:p-0">
                    {/* Header */}
                    <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                                {personal.name}
                            </h1>
                            <p className="text-base md:text-lg font-semibold text-primary mt-1">
                                Data Scientist · Data Analyst · Software Developer
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{personal.location}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1.5 text-xs font-mono text-muted-foreground">
                            <a href={`mailto:${personal.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Mail className="w-3.5 h-3.5" /> {personal.email}
                            </a>
                            <a href="https://linkedin.com/in/yuliani-purwitasari" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Linkedin className="w-3.5 h-3.5" /> linkedin.com/in/yuliani-purwitasari
                            </a>
                            <a href="https://github.com/ririsariii" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Github className="w-3.5 h-3.5" /> github.com/ririsariii
                            </a>
                        </div>
                    </div>

                    {/* Summary */}
                    <section>
                        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary mb-3">Profile Summary</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{personal.bio}</p>
                    </section>

                    {/* Education */}
                    <section>
                        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <h3 className="font-bold text-foreground">{edu.institution}</h3>
                                        <span className="text-xs font-mono text-primary font-semibold">GPA / Score: {edu.gpa}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{edu.degree} — {edu.major}</p>
                                    {edu.achievements && (
                                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                                            {edu.achievements.map((a, i) => <li key={i}>{a}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Work & Bootcamp Experience */}
                    <section>
                        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Experience
                        </h2>
                        <div className="space-y-5">
                            {workAndBootcamp.map((exp) => (
                                <div key={exp.id} className="border-l-2 border-primary/30 pl-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <h3 className="font-bold text-foreground">{exp.position}</h3>
                                        <span className="text-xs font-mono text-muted-foreground">{exp.company}</span>
                                    </div>
                                    <ul className="mt-2 space-y-1 text-xs md:text-sm text-muted-foreground list-disc list-inside">
                                        {exp.responsibilities?.map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Awards & Certifications */}
                    <section>
                        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                            <Award className="w-4 h-4" /> Honors &amp; Certifications ({certCount}+ Credentials)
                        </h2>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                            {awards.map((award) => (
                                <li key={award.id}>
                                    <strong className="text-foreground">{award.title}</strong> — {award.description}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Featured Projects */}
                    <section>
                        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                            <Code2 className="w-4 h-4" /> Selected Projects ({projects.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {projects.slice(0, 6).map((p) => (
                                <div key={p.id} className="p-3.5 rounded-xl bg-muted/20 border border-border/40">
                                    <h3 className="font-bold text-sm text-foreground">{p.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                                    <p className="text-[11px] font-mono text-primary mt-2">{p.techStack.join(' · ')}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Organization & Committee Leadership */}
                    <section>
                        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary mb-3">
                            Organization &amp; Committee Highlights
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                            {orgAndCommittee.map((org) => (
                                <div key={org.id} className="p-2.5 rounded-lg bg-muted/20 border border-border/30">
                                    <div className="font-semibold text-foreground">{org.position}</div>
                                    <div>{org.company}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary mb-3">Technical &amp; Soft Skills</h2>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <p><strong className="text-foreground">Hard Skills:</strong> {hardSkills.map((s) => s.name).join(', ')}</p>
                            <p><strong className="text-foreground">Tools &amp; Platforms:</strong> {tools.map((t) => t.name).join(', ')}</p>
                            <p><strong className="text-foreground">Soft Skills:</strong> {softSkills.map((s) => s.name).join(', ')}</p>
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
