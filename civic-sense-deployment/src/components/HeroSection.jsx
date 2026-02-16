import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import heroSky from "@/assets/hero-sky.jpg";

const GITHUB_URL = "https://github.com/rahil-den/civic-sense";

const leftTexts = [
    "Empowering citizens to report urban issues directly from their smartphones with precise geolocation.",
    "Building transparent bridges between residents and city authorities through real-time civic data.",
    "Transforming how communities interact with municipal infrastructure management systems.",
];

const rightWords = [
    ["Report", "Track", "Resolve", "civic", "issues", "in", "real-time", "with", "smart", "city", "technology."],
    ["Community", "driven", "insights", "powering", "smarter", "urban", "decision", "making", "every", "single", "day."],
    ["Modern", "infrastructure", "meets", "citizen", "engagement", "for", "a", "better", "tomorrow", "ahead", "now."],
];

const HeroSection = () => {
    const sectionRef = useRef(null);
    const headlineRef = useRef(null);
    const phoneRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const [leftIdx, setLeftIdx] = useState(0);
    const [rightIdx, setRightIdx] = useState(0);
    const leftTextRef = useRef(null);
    const rightTextRef = useRef(null);

    useEffect(() => {
        if (!headlineRef.current || !phoneRef.current || !leftRef.current || !rightRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.fromTo(headlineRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 }
            )
                .fromTo(
                    phoneRef.current,
                    { y: 300, scale: 0.9, opacity: 0 },
                    { y: 0, scale: 1, opacity: 1, duration: 1.2 },
                    "-=0.3"
                )
                .fromTo(
                    leftRef.current,
                    { x: -40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8 },
                    "-=0.6"
                )
                .fromTo(
                    rightRef.current.children,
                    { y: 15, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.04 },
                    "-=0.5"
                );
        });

        return () => ctx.revert();
    }, []);

    const handleLeftHover = () => {
        const next = (leftIdx + 1) % leftTexts.length;
        if (leftTextRef.current) {
            gsap.to(leftTextRef.current, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    setLeftIdx(next);
                    gsap.to(leftTextRef.current, { opacity: 1, duration: 0.3 });
                },
            });
        }
    };

    const handleRightHover = () => {
        const next = (rightIdx + 1) % rightWords.length;
        if (rightTextRef.current) {
            gsap.to(rightTextRef.current.children, {
                opacity: 0,
                y: -5,
                duration: 0.15,
                stagger: 0.02,
                onComplete: () => {
                    setRightIdx(next);
                    gsap.fromTo(
                        rightTextRef.current.children,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.3, stagger: 0.03 }
                    );
                },
            });
        }
    };

    return (
        <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src={heroSky} alt="Urban skyline" className="w-full h-full object-cover" />
                <div className="civic-gradient-overlay absolute inset-0" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 pt-28 pb-16 flex flex-col items-center">
                {/* Headline */}
                <h1
                    ref={headlineRef}
                    className="text-4xl md:text-6xl lg:text-7xl font-black text-center leading-tight max-w-5xl mb-4"
                    style={{ color: "var(--color-primary-foreground)" }}
                >
                    Redefining Urban
                    <br />
                    <span style={{ color: "var(--color-civic-sky)" }}>Civic Responsibility</span>
                </h1>
                <p
                    className="text-lg md:text-xl text-center max-w-2xl mb-8"
                    style={{ color: "var(--color-primary-foreground)", opacity: 0.7 }}
                >
                    Smart city infrastructure meets community-driven issue reporting
                </p>

                {/* CTA */}
                <div className="flex gap-4 mb-12">
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="civic-btn-hero">
                        View on GitHub
                    </a>
                    <button
                        onClick={() => { const el = document.getElementById('showcase'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                        className="civic-btn-outline-hero cursor-pointer"
                    >
                        Explore App
                    </button>
                </div>

                {/* Main layout: left desc + phone + right desc */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 w-full max-w-6xl">
                    {/* Left description */}
                    <div
                        ref={leftRef}
                        className="flex-1 text-left hidden lg:block cursor-pointer"
                        onMouseEnter={handleLeftHover}
                    >
                        <p
                            ref={leftTextRef}
                            className="text-base leading-relaxed max-w-xs"
                            style={{ color: "var(--color-primary-foreground)", opacity: 0.8 }}
                        >
                            {leftTexts[leftIdx]}
                        </p>
                    </div>

                    {/* Phone mockup */}
                    <div ref={phoneRef} className="relative z-20 -mt-8">
                        <div className="phone-frame w-[260px] md:w-[280px] civic-glow">
                            <div className="phone-notch" />
                            <div className="phone-screen">
                                <PhoneHomeScreen />
                            </div>
                        </div>
                    </div>

                    {/* Right description */}
                    <div
                        ref={rightRef}
                        className="flex-1 text-right hidden lg:block cursor-pointer"
                        onMouseEnter={handleRightHover}
                    >
                        <div ref={rightTextRef} className="flex flex-wrap justify-end gap-1.5 max-w-xs ml-auto">
                            {rightWords[rightIdx].map((word, i) => (
                                <span
                                    key={`${rightIdx}-${i}`}
                                    className="text-base"
                                    style={{ color: "var(--color-primary-foreground)", opacity: 0.8 }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const PhoneHomeScreen = () => (
    <div className="w-full h-full p-4 pt-8 flex flex-col gap-3" style={{ background: "var(--color-background)" }}>
        {/* Status bar */}
        <div className="flex justify-between items-center text-[10px] px-1" style={{ color: "var(--color-muted-foreground)" }}>
            <span className="font-semibold">9:41</span>
            <div className="flex gap-1">
                <div className="w-3 h-2 rounded-sm" style={{ background: "var(--color-foreground)", opacity: 0.3 }} />
                <div className="w-3 h-2 rounded-sm" style={{ background: "var(--color-foreground)", opacity: 0.3 }} />
                <div className="w-4 h-2 rounded-sm" style={{ background: "var(--color-primary)" }} />
            </div>
        </div>

        {/* App header */}
        <div className="text-center mt-2">
            <h3 className="text-sm font-bold" style={{ color: "var(--color-foreground)" }}>Civic Sense</h3>
            <p className="text-[10px]" style={{ color: "var(--color-muted-foreground)" }}>Report Urban Issues</p>
        </div>

        {/* Map placeholder */}
        <div className="flex-1 rounded-xl relative overflow-hidden min-h-[120px]" style={{ background: "var(--color-secondary)" }}>
            <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full" style={{
                    background: `
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px),
            linear-gradient(var(--color-border) 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px',
                }} />
            </div>
            {/* Map pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg" style={{ background: "var(--color-primary)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-primary-foreground)" }} />
                </div>
                <div className="w-2 h-4 mx-auto -mt-0.5 rounded-b" style={{ background: "var(--color-primary)" }} />
            </div>
        </div>

        {/* Report button */}
        <a
            href="https://github.com/rahil-den/civic-sense"
            target="_blank"
            rel="noopener noreferrer"
            className="civic-btn-hero text-xs py-2 rounded-xl text-center"
        >
            Report Issue
        </a>

        {/* Bottom stats */}
        <div className="flex gap-2">
            <div className="flex-1 rounded-lg p-2 text-center" style={{ background: "var(--color-secondary)" }}>
                <p className="text-xs font-bold" style={{ color: "var(--color-foreground)" }}>24</p>
                <p className="text-[9px]" style={{ color: "var(--color-muted-foreground)" }}>Reports</p>
            </div>
            <div className="flex-1 rounded-lg p-2 text-center" style={{ background: "var(--color-secondary)" }}>
                <p className="text-xs font-bold" style={{ color: "var(--color-foreground)" }}>18</p>
                <p className="text-[9px]" style={{ color: "var(--color-muted-foreground)" }}>Resolved</p>
            </div>
            <div className="flex-1 rounded-lg p-2 text-center" style={{ background: "var(--color-secondary)" }}>
                <p className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>75%</p>
                <p className="text-[9px]" style={{ color: "var(--color-muted-foreground)" }}>Rate</p>
            </div>
        </div>
    </div>
);

export default HeroSection;
