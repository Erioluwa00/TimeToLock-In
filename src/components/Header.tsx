import React from 'react';
import { Flame, Award, Menu } from 'lucide-react';
import { playClickSound } from './AudioSynthesizer';

interface HeaderProps {
  streakCount: number;
  completedCount: number;
  totalCount: number;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  streakCount, 
  completedCount, 
  totalCount,
  onMenuClick
}) => {
  return (
    <header className="app-header glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onMenuClick && (
          <button 
            className="mobile-sidebar-toggle-navbar" 
            onClick={() => { playClickSound(); onMenuClick(); }}
            title="Open Menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="header-brand" onClick={() => playClickSound()}>
          <div className="logo-container">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simple Clean Bolder Stopwatch Circle */}
              <circle cx="20" cy="22" r="16" stroke="var(--accent)" strokeWidth="3.5" />
              {/* Top crown button */}
              <rect x="18" y="2" width="4" height="3" rx="0.5" fill="var(--accent)" />
              {/* Target focus dot */}
              <circle cx="20" cy="22" r="5.5" fill="var(--accent)" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">TimeToLock-In</span>
            <span className="brand-tagline">Focus & Get Done</span>
          </div>
        </div>
      </div>

      <div className="header-stats">
        <div className="stat-pill streak-pill" title="Daily Task Streak">
          <Flame size={18} className="icon-fire animate-pulse" />
          <span className="stat-val">
            {streakCount}
            <span className="streak-text-label"> day streak</span>
          </span>
        </div>

        <div className="stat-pill progress-pill" title="Total Tasks Completed Today">
          <Award size={18} className="icon-badge" />
          <span className="stat-val">
            {completedCount}/{totalCount}
            <span className="progress-text-label"> Done</span>
          </span>
        </div>
      </div>
    </header>
  );
};
