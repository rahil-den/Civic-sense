import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const authors = [
    {
        name: "Rahil",
        role: "Project Lead & Web Designer",
        desc: "The visionary behind Civic Sense — Rahil conceptualized and designed every aspect of both the deployment website and the mobile application from the ground up. From defining the information architecture and user flows to deciding what each section contains, how every feature works, and what data the platform captures — Rahil orchestrated the complete product design. He led the team through the full development lifecycle, making critical architecture decisions and ensuring the final product delivers a seamless, intuitive experience for citizens reporting civic issues.",
        avatar: "https://github.com/rahil-den.png",
        github: "https://github.com/rahil-den",
        linkedin: "https://www.linkedin.com/in/rahil-shaikh-b2b7652b5/",
        accent: "var(--color-primary)",
    },
    {
        name: "Talha",
        role: "Mobile Dev + Backend for Mobile",
        desc: "Talha is the driving force behind the Civic Sense mobile application. He built the entire React Native + Expo frontend for the mobile app, implementing every screen, interaction, and user flow. Beyond the UI, Talha connected the mobile client to the backend API, handled real-time data synchronization, and implemented OAuth-based authentication for secure mobile login. He also contributed to the backend services that power the mobile experience, ensuring smooth data flow between the app and server.",
        avatar: "https://github.com/Talha201111.png",
        github: "https://github.com/Talha201111",
        linkedin: "https://www.linkedin.com/in/talha-bagban-80b85623a/",
        accent: "var(--color-accent)",
    },
    {
        name: "Iyan",
        role: "Backend Developer",
        desc: "Iyan architected and built the entire backend infrastructure that powers Civic Sense. He designed and implemented the MongoDB collections, Mongoose schemas, and all 19 data models. Iyan built every controller, route handler, and middleware — including the role-based access control (RBAC) system that manages User, Admin, and SuperAdmin permissions. He also set up Redis caching for analytics, rate limiting for API security, Socket.io for real-time notifications, and the PDF/CSV export pipelines for governance reporting.",
        avatar: "https://github.com/iyan-devcore.png",
        github: "https://github.com/iyan-devcore",
        linkedin: "https://www.linkedin.com/in/iyan-dhanani-a24a003a3/",
        accent: "var(--color-civic-sky)",
    },
    {
        name: "Kaif",
        role: "Backend + Web Dev",
        desc: "Kaif built the web-based admin and super-admin dashboard that gives city authorities full control over issue management. He developed the React admin UI from scratch — implementing analytics views, issue management panels, user moderation tools, and governance reporting interfaces. Kaif then connected every component to the backend API, ensuring real-time data flows between the dashboard and server. His work enables administrators to efficiently track, manage, and resolve civic issues at scale.",
        avatar: "https://github.com/KaifCodes20.png",
        github: "https://github.com/KaifCodes20",
        linkedin: "https://www.linkedin.com/in/kaif-shaikh-a2799236a/",
        accent: "var(--color-primary)",
    },
];

const AuthorsSection = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const cards = cardsRef.current.filter(Boolean);
        if (cards.length === 0) return;

        const ctx = gsap.context(() => {
            cards.forEach((card, i) => {
                if (i > 0) {
                    gsap.set(card, { yPercent: 100 });
                }

                // Gently scale down and fade previous cards (no brightness filter)
                if (i < cards.length - 1) {
                    gsap.to(card, {
                        scale: 0.95 - i * 0.015,
                        y: -20 * (i + 1),
                        opacity: 0.85 - i * 0.05,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: () => `top+=${(i + 1) * window.innerHeight * 0.8} top`,
                            end: () => `top+=${(i + 2) * window.innerHeight * 0.8} top`,
                            scrub: 1,
                        },
                    });
                }

                // Slide each card up into view
                if (i > 0) {
                    gsap.to(card, {
                        yPercent: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: () => `top+=${i * window.innerHeight * 0.8} top`,
                            end: () => `top+=${(i + 1) * window.innerHeight * 0.8} top`,
                            scrub: 1,
                        },
                    });
                }
            });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${cards.length * window.innerHeight * 0.8}`,
                pin: true,
                pinSpacing: true,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="authors"
            className="relative overflow-hidden"
            style={{ height: "100vh", background: "color-mix(in srgb, var(--color-secondary) 30%, transparent)" }}
        >
            {/* Section header */}
            <div className="absolute top-0 left-0 w-full z-50 pt-8 pb-4 text-center pointer-events-none">
                <p className="text-sm font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--color-primary)" }}>
                    The Team
                </p>
                <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: "var(--color-foreground)" }}>
                    Built by Passionate Minds
                </h2>
            </div>

            {/* Stacked cards container */}
            <div className="absolute inset-0 top-24 md:top-32">
                {authors.map((author, i) => (
                    <div
                        key={author.name}
                        ref={(el) => {
                            if (el) cardsRef.current[i] = el;
                        }}
                        className="absolute inset-0 flex items-center justify-center px-4 md:px-8"
                        style={{ zIndex: i + 1 }}
                    >
                        <div
                            className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
                            style={{
                                background: "var(--color-card)",
                                minHeight: "min(70vh, 500px)",
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 h-full" style={{ minHeight: "inherit" }}>
                                {/* Left - Avatar & Identity */}
                                <div
                                    className="flex flex-col items-center justify-center p-8 md:p-12 relative"
                                    style={{
                                        minHeight: "min(35vh, 250px)",
                                        background: `linear-gradient(135deg, var(--color-primary), ${author.accent})`,
                                    }}
                                >
                                    <div
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-6 shadow-xl"
                                        style={{
                                            border: "4px solid rgba(255,255,255,0.3)",
                                        }}
                                    >
                                        <img
                                            src={author.avatar}
                                            alt={author.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: "var(--color-primary-foreground)" }}>
                                        {author.name}
                                    </h3>
                                    <p
                                        className="text-sm md:text-base font-semibold uppercase tracking-widest mt-2"
                                        style={{ color: "var(--color-primary-foreground)", opacity: 0.8 }}
                                    >
                                        {author.role}
                                    </p>
                                </div>

                                {/* Right - Description & CTA */}
                                <div className="flex flex-col justify-center p-8 md:p-12">
                                    <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: "var(--color-muted-foreground)" }}>
                                        {author.desc}
                                    </p>
                                    <p className="text-xs leading-relaxed mb-8" style={{ color: "var(--color-muted-foreground)", opacity: 0.6 }}>
                                        This deployment website and the Civic Sense mobile
                                        application were conceptualized and built to modernize
                                        urban civic issue reporting and make cities smarter through
                                        community-driven participation.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <a
                                            href={author.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-bold hover:underline transition-all group"
                                            style={{ color: "var(--color-primary)" }}
                                        >
                                            <Github className="w-4 h-4" />
                                            GitHub
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </a>
                                        <a
                                            href={author.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-bold transition-all group"
                                            style={{ color: "#0A66C2" }}
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            LinkedIn
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AuthorsSection;
