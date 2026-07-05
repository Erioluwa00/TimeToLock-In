import React, { useEffect, useState } from 'react';
import { Flame, Award } from 'lucide-react';
import { playClickSound } from './AudioSynthesizer';

interface HeaderProps {
  streakCount: number;
  completedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ streakCount, completedCount, totalCount }) => {
  const [greeting, setGreeting] = useState("Hello");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hrs = now.getHours();
      
      if (hrs < 12) setGreeting("Good morning ☀️");
      else if (hrs < 18) setGreeting("Good afternoon 👋");
      else setGreeting("Good evening 🌙");

      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      };
      setTimeStr(now.toLocaleDateString('en-US', options));
    };

    updateTimeAndGreeting();
    // Update every minute
    const interval = setInterval(updateTimeAndGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-header glass">
      <div className="header-brand" onClick={() => playClickSound()}>
        <div className="logo-container">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--accent-secondary)" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Padlock loop */}
            <path d="M13 16V10.5C13 6.63401 16.134 3.5 20 3.5C23.866 3.5 27 6.63401 27 10.5V16" 
                  stroke="url(#logo-grad)" 
                  strokeWidth="3.2" 
                  strokeLinecap="round" 
            />
            {/* Padlock body */}
            <rect x="7" y="14" width="26" height="22" rx="6.5" fill="var(--bg-card)" stroke="url(#logo-grad)" strokeWidth="3.2" filter="url(#glow)" />
            {/* Clock Circle */}
            <circle cx="20" cy="25" r="5" stroke="var(--text-secondary)" strokeWidth="1.8" />
            <path d="M20 22.5V25H22.5" stroke="url(#logo-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-title">TimeToLock-In</span>
          <span className="brand-tagline">Focus & Get Done</span>
        </div>
      </div>

      <div className="header-greeting">
        <h1 className="greeting-text">{greeting}</h1>
        <p className="greeting-date">{timeStr}</p>
      </div>

      <div className="header-stats">
        <div className="stat-pill streak-pill" title="Daily Task Streak">
          <Flame size={18} className="icon-fire animate-pulse" />
          <span className="stat-val">{streakCount} day streak</span>
        </div>

        <div className="stat-pill progress-pill" title="Total Tasks Completed Today">
          <Award size={18} className="icon-badge" />
          <span className="stat-val">
            {completedCount}/{totalCount} Done
          </span>
        </div>
      </div>
    </header>
  );
};
