import React from 'react';
import { Flame, Award } from 'lucide-react';
import { playClickSound } from './AudioSynthesizer';

interface HeaderProps {
  streakCount: number;
  completedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ streakCount, completedCount, totalCount }) => {
  return (
    <header className="app-header glass">
      <div className="header-brand" onClick={() => playClickSound()}>
        <div className="logo-container">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Outer stopwatch ring */}
            <circle cx="20" cy="22" r="12" stroke="var(--accent)" strokeWidth="3" filter="url(#logo-glow)" />
            {/* Stopwatch top button / crown */}
            <rect x="18.5" y="6" width="3" height="3.5" rx="0.5" fill="var(--accent)" />
            {/* Stopwatch side clicker */}
            <rect x="27.5" y="9.5" width="2" height="2.5" rx="0.5" transform="rotate(30 27.5 9.5)" fill="var(--accent)" />
            {/* Crosshair lines (Target / Lock-In effect) */}
            <line x1="20" y1="13.5" x2="20" y2="17" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="27" x2="20" y2="30.5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="11.5" y1="22" x2="15" y2="22" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="25" y1="22" x2="28.5" y2="22" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Inner focus target dot */}
            <circle cx="20" cy="22" r="4" fill="var(--accent)" />
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-title">TimeToLock-In</span>
          <span className="brand-tagline">Focus & Get Done</span>
        </div>
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
