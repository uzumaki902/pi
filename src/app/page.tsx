"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const valueAddRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const car = carRef.current;
    const trail = trailRef.current;
    const valueAdd = valueAddRef.current;
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

    if (!car || !trail || !valueAdd || letters.length === 0) return;

    // Use GSAP context for clean cleanup
    const ctx = gsap.context(() => {
      // Calculate letter offsets
      const valueRect = valueAdd.getBoundingClientRect();
      const letterOffsets = letters.map((letter) => {
        // Need absolute offset relative to the road
        return letter.offsetLeft;
      });

      const roadWidth = window.innerWidth;
      // Get actual car width from bounding rect to ensure accuracy
      const carRect = car.getBoundingClientRect();
      const carWidth = carRect.width || 150;
      const endX = roadWidth - carWidth;

      // 1. Car movement and trail/letter reveal logic
      gsap.to(car, {
        scrollTrigger: {
          trigger: ".section",
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: ".track",
        },
        x: endX,
        ease: "none",
        onUpdate: function () {
          // Calculate the car's absolute front position
          const carX = gsap.getProperty(car, "x") as number;
          const carFrontX = carX + carWidth / 2;

          // Reveal letters as car passes them
          letters.forEach((letter, i) => {
            // valueRect.left is the offset of the whole text container
            const letterX = valueRect.left + letterOffsets[i];
            
            if (carFrontX >= letterX) {
              letter.style.opacity = "1";
            } else {
              letter.style.opacity = "0";
            }
          });

          // Update trail width to follow the car exactly
          gsap.set(trail, { width: carFrontX });
        },
      });

      // 2. Stat boxes reveal logic
      gsap.to("#box1", {
        scrollTrigger: {
          trigger: ".section",
          start: "top+=400 top",
          end: "top+=600 top",
          scrub: true,
        },
        opacity: 1,
      });

      gsap.to("#box2", {
        scrollTrigger: {
          trigger: ".section",
          start: "top+=600 top",
          end: "top+=800 top",
          scrub: true,
        },
        opacity: 1,
      });

      gsap.to("#box3", {
        scrollTrigger: {
          trigger: ".section",
          start: "top+=800 top",
          end: "top+=1000 top",
          scrub: true,
        },
        opacity: 1,
      });

      gsap.to("#box4", {
        scrollTrigger: {
          trigger: ".section",
          start: "top+=1000 top",
          end: "top+=1200 top",
          scrub: true,
        },
        opacity: 1,
      });
    });

    return () => ctx.revert();
  }, []);

  const headline = "WELCOME ITZFIZZ";

  return (
    <div className="section" ref={sectionRef}>
      <div className="track" ref={trackRef}>
        
        {/* The Road */}
        <div className="road" id="road">
          <img
            ref={carRef}
            src="/pi/car.jpg"
            alt="car"
            className="car"
            id="car"
            draggable={false}
          />
          <div className="trail" id="trail" ref={trailRef}></div>
          
          <div className="value-add" id="valueText" ref={valueAddRef}>
            {headline.split("").map((char, index) => (
              <span
                key={index}
                className="value-letter"
                ref={(el) => {
                  lettersRef.current[index] = el;
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        {/* Stat Boxes */}
        <div className="text-box" id="box1">
          <span className="num-box">58%</span> Increase in pick up point use
        </div>
        <div className="text-box" id="box2">
          <span className="num-box">23%</span> Decreased in customer phone calls
        </div>
        <div className="text-box" id="box3">
          <span className="num-box">27%</span> Increase in pick up point use
        </div>
        <div className="text-box" id="box4">
          <span className="num-box">40%</span> Decreased in customer phone calls
        </div>
        
      </div>
    </div>
  );
}
