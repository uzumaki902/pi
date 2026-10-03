"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Stat card data ─── */
const STATS = [
  {
    value: "58%",
    label: "Increase in pick up point use",
    variant: "lime",
    position: { top: "8%", right: "12%" },
  },
  {
    value: "27%",
    label: "Faster delivery turnaround",
    variant: "dark",
    position: { top: "8%", right: "calc(12% + 240px)" },
  },
  {
    value: "23%",
    label: "Decreased in customer phone calls",
    variant: "cyan",
    position: { bottom: "8%", right: "40%" },
  },
  {
    value: "40%",
    label: "Reduction in logistics overhead",
    variant: "orange",
    position: { bottom: "8%", right: "calc(40% - 250px)" },
  },
];

/* ─── Feature cards data ─── */
const FEATURES = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description:
      "Optimised delivery routes powered by real-time traffic data ensure packages arrive faster than ever.",
    accent: "#45db7d",
  },
  {
    icon: "🎯",
    title: "Precision Tracking",
    description:
      "GPS-enabled tracking with sub-metre accuracy so you always know exactly where your delivery is.",
    accent: "#00d2ff",
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    description:
      "End-to-end encryption and tamper-proof packaging protocols protect every shipment.",
    accent: "#ff8c32",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLSpanElement>(null);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const speedLinesRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ─────── INTRO ANIMATIONS ─────── */

      // Headline staggered reveal
      const headlineText = headlineRef.current;
      if (headlineText) {
        // Wrap each character in a span for staggered animation
        const text = headlineText.textContent || "";
        headlineText.innerHTML = text
          .split("")
          .map(
            (char) =>
              `<span style="display:inline-block; opacity:0; transform:translateY(30px);">${char === " " ? "&nbsp;" : char}</span>`
          )
          .join("");

        gsap.to(headlineText.querySelectorAll("span"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.out",
          delay: 0.3,
        });
      }

      // Subtitle fade in
      gsap.from(subRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.2,
      });

      // Scroll indicator fade in
      gsap.to(scrollIndicatorRef.current, {
        opacity: 1,
        duration: 1,
        delay: 1.8,
        ease: "power2.out",
      });

      // Background glows fade in
      glowRefs.current.forEach((glow, i) => {
        gsap.to(glow, {
          opacity: 1,
          duration: 1.5,
          delay: 0.5 + i * 0.3,
          ease: "power2.out",
        });
      });

      // Particles subtle float
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll(".particle");
        particles.forEach((p) => {
          gsap.to(p, {
            y: `random(-30, 30)`,
            x: `random(-20, 20)`,
            opacity: `random(0.05, 0.25)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }

      /* ─────── SCROLL-DRIVEN ANIMATIONS ─────── */

      const roadEl = document.querySelector(".road") as HTMLElement;
      const roadWidth = roadEl?.offsetWidth || window.innerWidth;

      // Main scroll timeline — car moves across the road
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            // Progress bar
            if (progressRef.current) {
              gsap.set(progressRef.current, {
                width: `${self.progress * 100}%`,
              });
            }
          },
        },
      });

      // Car drives across the viewport
      scrollTl.to(
        carRef.current,
        {
          x: roadWidth + 100,
          duration: 1,
          ease: "none",
        },
        0
      );

      // Trail grows behind the car
      scrollTl.to(
        trailRef.current,
        {
          width: "100%",
          duration: 1,
          ease: "none",
        },
        0
      );

      // Speed lines appear during middle of scroll
      scrollTl.to(
        speedLinesRef.current,
        {
          opacity: 0.6,
          duration: 0.2,
          ease: "power2.in",
        },
        0.15
      );
      scrollTl.to(
        speedLinesRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        0.7
      );

      // Hide scroll indicator on scroll
      scrollTl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.1,
          ease: "power2.in",
        },
        0
      );

      // Stats cards appear as car passes certain scroll positions
      statsRefs.current.forEach((stat, i) => {
        if (!stat) return;
        const delay = 0.15 + i * 0.15; // Stagger appearance with scroll
        scrollTl.to(
          stat,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.15,
            ease: "back.out(1.4)",
          },
          delay
        );
      });

      // Background glow intensity increases with scroll
      glowRefs.current.forEach((glow) => {
        scrollTl.to(
          glow,
          {
            opacity: 0.8,
            scale: 1.3,
            duration: 1,
            ease: "power1.inOut",
          },
          0
        );
      });

      /* ─────── Feature cards scroll reveal ─────── */
      gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.5,
          },
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 1,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  /* ─── Generate decorative particles ─── */
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.15 + 0.05,
  }));

  /* ─── Generate speed lines ─── */
  const speedLines = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${10 + Math.random() * 80}%`,
    width: `${20 + Math.random() * 40}%`,
    left: `${Math.random() * 60}%`,
    opacity: Math.random() * 0.08 + 0.02,
  }));

  return (
    <>
      {/* Progress Bar */}
      <div ref={progressRef} className="progress-bar" />

      {/* ────── HERO SECTION ────── */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-sticky">
          {/* Background Glows */}
          <div
            ref={(el) => {
              glowRefs.current[0] = el;
            }}
            className="bg-glow bg-glow--green"
          />
          <div
            ref={(el) => {
              glowRefs.current[1] = el;
            }}
            className="bg-glow bg-glow--blue"
          />

          {/* Particles */}
          <div ref={particlesRef} className="absolute inset-0 z-0">
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  top: p.top,
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  opacity: p.opacity,
                }}
              />
            ))}
          </div>

          {/* Headline */}
          <div className="headline-wrapper">
            <h1 ref={headlineRef} className="headline">
              WELCOME
            </h1>
            <span ref={subRef} className="headline-sub">
              ITZFIZZ
            </span>
          </div>

          {/* Track Container */}
          <div className="track-container">
            {/* Stats */}
            <div className="stats-container">
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    statsRefs.current[i] = el;
                  }}
                  className={`stat-card stat-card--${stat.variant}`}
                  style={{
                    ...stat.position,
                    transform: "translateY(20px) scale(0.9)",
                  }}
                >
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Road */}
            <div className="road">
              {/* Speed Lines */}
              <div ref={speedLinesRef} className="speed-lines">
                {speedLines.map((sl) => (
                  <div
                    key={sl.id}
                    className="speed-line"
                    style={{
                      top: sl.top,
                      left: sl.left,
                      width: sl.width,
                      opacity: sl.opacity,
                    }}
                  />
                ))}
              </div>

              {/* Trail */}
              <div ref={trailRef} className="trail">
                <div className="trail-gradient" />
              </div>

              {/* Car */}
              <img
                ref={carRef}
                src="/car.jpg"
                alt="Orange supercar top-down view"
                className="car-wrapper car-image"
                draggable={false}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0",
                  transform: "translateY(-50%)",
                  zIndex: 15,
                  height: "180px",
                  width: "auto",
                }}
              />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div ref={scrollIndicatorRef} className="scroll-indicator">
            <span>Scroll</span>
            <div className="scroll-arrow" />
          </div>
        </div>
      </section>

      {/* ────── CONTENT SECTION ────── */}
      <section className="content-section">
        <h2>Built for Speed</h2>
        <p>
          Our cutting-edge logistics platform redefines last-mile delivery with
          intelligent routing, real-time analytics, and seamless customer
          experiences.
        </p>

        <div className="features-grid">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="feature-card"
              style={{ "--accent": feat.accent } as React.CSSProperties}
            >
              <span className="feature-icon">{feat.icon}</span>
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="footer">
        <p>
          Crafted with precision &bull; Scroll-Driven Animation Demo &bull;{" "}
          <a
            href="https://github.com/uzumaki902/pi"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source
          </a>
        </p>
      </footer>
    </>
  );
}
