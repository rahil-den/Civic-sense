import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Twitter, Linkedin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const GITHUB_URL = "https://github.com/rahil-den/civic-sense";

const FooterSection = () => {
    const footerRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        if (!ctaRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(ctaRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 80%",
                    },
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} id="footer" className="relative overflow-hidden" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    background: `radial-gradient(circle at 20% 50%, hsl(0 0% 100% / 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 80% 50%, hsl(0 0% 100% / 0.05) 0%, transparent 50%)`,
                }} />
            </div>

            <div className="container mx-auto px-6 py-20 relative z-10">
                {/* CTA */}
                <div ref={ctaRef} className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                        Be Part of a Smarter
                        <br />
                        Urban Future
                    </h2>
                    <p className="max-w-lg mx-auto mb-8" style={{ color: "var(--color-primary-foreground)", opacity: 0.7 }}>
                        Join a growing community of citizens building responsive, transparent, and smarter cities together.
                    </p>
                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="civic-btn-footer text-base px-10 py-4"
                    >
                        Join Your City
                    </a>
                </div>

                {/* Divider */}
                <div className="h-px mb-12" style={{ background: "rgba(255,255,255,0.1)" }} />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "var(--color-primary-foreground)" }}>
                            <span className="font-bold text-xs" style={{ color: "var(--color-primary)" }}>CS</span>
                        </div>
                        <span className="font-bold text-sm">Civic Sense</span>
                    </div>

                    <div className="flex gap-4">
                        {[
                            { icon: Github, href: GITHUB_URL },
                            { icon: Twitter, href: "#" },
                            { icon: Linkedin, href: "#" },
                        ].map(({ icon: Icon, href }, i) => (
                            <a
                                key={i}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "rgba(255,255,255,0.6)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "rgba(255,255,255,1)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                                }}
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>

                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        © 2025 Civic Sense. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
