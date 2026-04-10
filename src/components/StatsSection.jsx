import React, { useState, useEffect, useRef } from "react";
import "./StatsSection.css";

const StatItem = ({ label, initialValue, suffix = "+", isVisible, tickIntervalFast = false }) => {
  const [count, setCount] = useState(0);
  const [hasFinishedInitial, setHasFinishedInitial] = useState(false);

  // Initial Count-Up Animation
  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    let animationFrame;
    const duration = 2000; // 2 seconds

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(initialValue * easeOut));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(initialValue);
        setHasFinishedInitial(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [initialValue, isVisible]);

  // Live Ticker Effect
  useEffect(() => {
    if (!hasFinishedInitial) return;

    const randomizeTick = () => {
      // Faster tick for large general stats like Events/Students vs Awards
      const baseDelay = tickIntervalFast ? 3000 : 7000;
      const delay = Math.random() * baseDelay + 2000;
      
      return setTimeout(() => {
        setCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
        timeoutId = randomizeTick();
      }, delay);
    };

    let timeoutId = randomizeTick();
    return () => clearTimeout(timeoutId);
  }, [hasFinishedInitial, tickIntervalFast]);

  // Format comma separated for thousands if any
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="stat-item">
      <div className="stat-number">
        {formatNumber(count)}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section-wrapper" ref={sectionRef}>
      <div className="stats-container">
        <StatItem label="Events" initialValue={240} isVisible={isVisible} tickIntervalFast={true} />
        <div className="stat-divider"></div>
        <StatItem label="Clubs" initialValue={120} isVisible={isVisible} />
        <div className="stat-divider"></div>
        <StatItem label="Students" initialValue={12} suffix="K+" isVisible={isVisible} tickIntervalFast={true} />
        <div className="stat-divider"></div>
        <StatItem label="Awards" initialValue={85} isVisible={isVisible} />
      </div>
    </section>
  );
}
