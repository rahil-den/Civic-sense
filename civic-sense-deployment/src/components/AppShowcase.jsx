import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const screens = [
    {
        title: "Issue Reporting",
        subtitle: "Map-powered civic reports",
        content: (
            <div className="flex flex-col gap-3 p-4 pt-8 h-full">
                <div className="flex justify-between items-center text-[10px] px-1" style={{ color: "var(--color-muted-foreground)" }}>
                    <span className="font-semibold">9:41</span>
                    <span className="font-medium" style={{ color: "var(--color-foreground)" }}>Report Issue</span>
                    <span>•••</span>
                </div>
                {/* Map area */}
                <div className="flex-1 rounded-xl relative overflow-hidden min-h-[100px]" style={{ background: "var(--color-secondary)" }}>
                    <div className="absolute inset-0 opacity-20">
                        <div className="w-full h-full" style={{
                            background: `linear-gradient(90deg, var(--color-border) 1px, transparent 1px), linear-gradient(var(--color-border) 1px, transparent 1px)`,
                            backgroundSize: '18px 18px',
                        }} />
                    </div>
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{ background: "var(--color-primary)" }}>
                            <div className="w-3 h-3 rounded-full" style={{ background: "var(--color-primary-foreground)" }} />
                        </div>
                    </div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-lg shadow flex items-center justify-center" style={{ background: "var(--color-card)" }}>
                        <span className="text-[10px]">📍</span>
                    </div>
                </div>
                {/* Info cards */}
                <div className="rounded-xl shadow-sm p-3" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                    <p className="text-[11px] font-semibold" style={{ color: "var(--color-foreground)" }}>Pothole on Main St</p>
                    <p className="text-[9px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>Category: Road Damage</p>
                    <div className="flex gap-1 mt-2">
                        <span className="text-[8px] px-2 py-0.5 rounded-full font-medium" style={{ background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", color: "var(--color-primary)" }}>Urgent</span>
                        <span className="text-[8px] px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--color-secondary)", color: "var(--color-secondary-foreground)" }}>Public</span>
                    </div>
                </div>
                <div className="rounded-xl shadow-sm p-3 flex gap-2 items-center" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: "var(--color-secondary)" }}>📷</div>
                    <div>
                        <p className="text-[10px] font-semibold" style={{ color: "var(--color-foreground)" }}>Attach Photo</p>
                        <p className="text-[9px]" style={{ color: "var(--color-muted-foreground)" }}>Add evidence snapshot</p>
                    </div>
                </div>
                <button className="civic-btn-hero text-[11px] py-2.5 rounded-xl w-full">Submit Report</button>
            </div>
        ),
    },
    {
        title: "Tech Stack",
        subtitle: "Built with modern tools",
        content: (
            <div className="flex flex-col gap-3 p-4 pt-8 h-full">
                <div className="flex justify-between items-center text-[10px] px-1" style={{ color: "var(--color-muted-foreground)" }}>
                    <span className="font-semibold">9:41</span>
                    <span className="font-medium" style={{ color: "var(--color-foreground)" }}>Tech Stack</span>
                    <span>•••</span>
                </div>
                <p className="text-[11px] text-center" style={{ color: "var(--color-muted-foreground)" }}>Powered by cutting-edge technology</p>
                {[
                    { icon: "🚀", name: "Express.js", desc: "REST API framework" },
                    { icon: "🍃", name: "MongoDB", desc: "NoSQL database with Mongoose" },
                    { icon: "⚡", name: "Redis", desc: "Caching & rate limiting" },
                    { icon: "🔌", name: "Socket.io", desc: "Real-time communication" },
                    { icon: "⚛️", name: "React Native", desc: "Cross-platform mobile (v0.81)" },
                    { icon: "📦", name: "Expo SDK 54", desc: "Universal app platform" },
                    { icon: "🔄", name: "Redux Toolkit", desc: "Global state management" },
                    { icon: "⚙️", name: "React 19 + Vite", desc: "Web dashboard & deployment" },
                ].map((t) => (
                    <div key={t.name} className="flex items-center gap-3 rounded-xl shadow-sm p-3" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base" style={{ background: "var(--color-secondary)" }}>{t.icon}</div>
                        <div>
                            <p className="text-[11px] font-semibold" style={{ color: "var(--color-foreground)" }}>{t.name}</p>
                            <p className="text-[9px]" style={{ color: "var(--color-muted-foreground)" }}>{t.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Real-time Updates",
        subtitle: "Track issue resolution",
        content: (
            <div className="flex flex-col gap-3 p-4 pt-8 h-full">
                <div className="flex justify-between items-center text-[10px] px-1" style={{ color: "var(--color-muted-foreground)" }}>
                    <span className="font-semibold">9:41</span>
                    <span className="font-medium" style={{ color: "var(--color-foreground)" }}>Activity</span>
                    <span>•••</span>
                </div>
                <div className="flex gap-2 mb-1">
                    <span className="text-[9px] px-3 py-1 rounded-full font-medium" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>All</span>
                    <span className="text-[9px] px-3 py-1 rounded-full font-medium" style={{ background: "var(--color-secondary)", color: "var(--color-secondary-foreground)" }}>Pending</span>
                    <span className="text-[9px] px-3 py-1 rounded-full font-medium" style={{ background: "var(--color-secondary)", color: "var(--color-secondary-foreground)" }}>Resolved</span>
                </div>
                {[
                    { title: "Broken streetlight", status: "Resolved", time: "2h ago", color: "#22c55e" },
                    { title: "Water leak on 5th Ave", status: "In Progress", time: "5h ago", color: "#f59e0b" },
                    { title: "Graffiti on park wall", status: "Submitted", time: "1d ago", color: "var(--color-primary)" },
                    { title: "Pothole near school", status: "Resolved", time: "2d ago", color: "#22c55e" },
                ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                        <div className="flex flex-col items-center mt-1">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                            {i < 3 && <div className="w-px min-h-[30px]" style={{ background: "var(--color-border)" }} />}
                        </div>
                        <div className="flex-1 rounded-xl shadow-sm p-3" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                            <div className="flex justify-between items-start">
                                <p className="text-[11px] font-semibold" style={{ color: "var(--color-foreground)" }}>{item.title}</p>
                                <span className="text-[8px]" style={{ color: "var(--color-muted-foreground)" }}>{item.time}</span>
                            </div>
                            <span className="text-[9px] font-medium" style={{ color: "var(--color-muted-foreground)" }}>{item.status}</span>
                            {item.status === "Resolved" && (
                                <div className="mt-1.5 h-1 rounded-full" style={{ background: "rgba(34,197,94,0.2)" }}>
                                    <div className="h-full rounded-full w-full" style={{ background: "#22c55e" }} />
                                </div>
                            )}
                            {item.status === "In Progress" && (
                                <div className="mt-1.5 h-1 rounded-full" style={{ background: "rgba(245,158,11,0.2)" }}>
                                    <div className="h-full rounded-full w-3/5" style={{ background: "#f59e0b" }} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Community",
        subtitle: "Engage with your city",
        content: (
            <div className="flex flex-col gap-3 p-4 pt-8 h-full">
                <div className="flex justify-between items-center text-[10px] px-1" style={{ color: "var(--color-muted-foreground)" }}>
                    <span className="font-semibold">9:41</span>
                    <span className="font-medium" style={{ color: "var(--color-foreground)" }}>Community</span>
                    <span>•••</span>
                </div>
                {/* Stats */}
                <div className="flex gap-2">
                    <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "var(--color-primary)" }}>
                        <p className="text-lg font-bold" style={{ color: "var(--color-primary-foreground)" }}>1.2k</p>
                        <p className="text-[9px]" style={{ color: "var(--color-primary-foreground)", opacity: 0.7 }}>Contributors</p>
                    </div>
                    <div className="flex-1 rounded-xl shadow-sm p-3 text-center" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                        <p className="text-lg font-bold" style={{ color: "var(--color-foreground)" }}>890</p>
                        <p className="text-[9px]" style={{ color: "var(--color-muted-foreground)" }}>Issues Fixed</p>
                    </div>
                </div>
                <p className="text-[10px] font-semibold" style={{ color: "var(--color-foreground)" }}>Top Contributors</p>
                {[
                    { name: "Alex M.", points: "342 pts", rank: "🥇" },
                    { name: "Sarah K.", points: "289 pts", rank: "🥈" },
                    { name: "James L.", points: "215 pts", rank: "🥉" },
                ].map((u) => (
                    <div key={u.name} className="flex items-center gap-3 rounded-xl shadow-sm p-3" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                        <span className="text-base">{u.rank}</span>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "var(--color-secondary)", color: "var(--color-foreground)" }}>
                            {u.name[0]}
                        </div>
                        <div className="flex-1">
                            <p className="text-[11px] font-semibold" style={{ color: "var(--color-foreground)" }}>{u.name}</p>
                            <p className="text-[9px]" style={{ color: "var(--color-muted-foreground)" }}>{u.points}</p>
                        </div>
                        <div className="text-[10px] font-medium" style={{ color: "var(--color-primary)" }}>▲ 12</div>
                    </div>
                ))}
                <div className="rounded-xl p-3 text-center" style={{ background: "var(--color-secondary)" }}>
                    <p className="text-[10px] font-medium" style={{ color: "var(--color-secondary-foreground)" }}>🏆 Smart City Participation Score</p>
                    <div className="mt-2 h-2 rounded-full" style={{ background: "var(--color-background)" }}>
                        <div className="h-full rounded-full w-4/5" style={{ background: "var(--color-primary)" }} />
                    </div>
                    <p className="text-[9px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>80% — Level 4 Contributor</p>
                </div>
            </div>
        ),
    },
];

const AppShowcase = () => {
    const sectionRef = useRef(null);
    const phoneWrapRef = useRef(null);
    const screenRef = useRef(null);
    const [currentScreen, setCurrentScreen] = useState(0);
    const isAnimating = useRef(false);

    useEffect(() => {
        if (!phoneWrapRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(phoneWrapRef.current,
                { y: 80, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );
        });
        return () => ctx.revert();
    }, []);

    const animateScreen = (direction, next) => {
        if (isAnimating.current || !screenRef.current) return;
        isAnimating.current = true;

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating.current = false;
            },
        });

        tl.to(screenRef.current, {
            x: direction * -100,
            opacity: 0,
            duration: 0.3,
            ease: "power3.in",
        }).call(() => {
            setCurrentScreen(next);
        }).fromTo(
            screenRef.current,
            { x: direction * 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
        );
    };

    const goNext = () => {
        const next = (currentScreen + 1) % screens.length;
        animateScreen(1, next);
    };

    const goPrev = () => {
        const next = (currentScreen - 1 + screens.length) % screens.length;
        animateScreen(-1, next);
    };

    return (
        <section ref={sectionRef} id="showcase" className="py-24 md:py-32 relative" style={{ background: "var(--color-background)" }}>
            <div className="container mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--color-primary)" }}>Explore the App</p>
                    <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: "var(--color-foreground)" }}>
                        Experience Civic Sense
                    </h2>
                    <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
                        Browse through the actual app screens and discover how Civic Sense empowers communities.
                    </p>
                </div>

                {/* Phone + nav */}
                <div ref={phoneWrapRef} className="flex flex-col items-center">
                    {/* Screen title */}
                    <div className="mb-6 text-center">
                        <h3 className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>{screens[currentScreen].title}</h3>
                        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{screens[currentScreen].subtitle}</p>
                    </div>

                    {/* Phone */}
                    <div className="phone-frame w-[280px] md:w-[300px]" style={{
                        boxShadow: '0 25px 60px color-mix(in srgb, var(--color-civic-blue) 15%, transparent), 0 10px 20px hsl(0 0% 0% / 0.1)',
                    }}>
                        <div className="phone-notch" />
                        <div className="phone-screen">
                            <div ref={screenRef} className="w-full h-full overflow-y-auto">
                                {screens[currentScreen].content}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-6 mt-8">
                        <button onClick={goPrev} className="nav-circle-btn" aria-label="Previous screen">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                            {screens.map((_, i) => (
                                <div
                                    key={i}
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: i === currentScreen ? "1.5rem" : "0.5rem",
                                        background: i === currentScreen ? "var(--color-primary)" : "var(--color-muted-foreground)",
                                        opacity: i === currentScreen ? 1 : 0.3,
                                    }}
                                />
                            ))}
                        </div>
                        <button onClick={goNext} className="nav-circle-btn" aria-label="Next screen">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppShowcase;
