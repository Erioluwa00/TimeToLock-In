import React, { useState, useEffect, useRef } from 'react';
import type { Task } from '../types/task';
import { Play, Pause, RotateCcw, X, Check, Target } from 'lucide-react';
import { playClickSound, playTimerEndSound } from './AudioSynthesizer';

interface FocusModeProps {
  isActive: boolean;
  task: Task | null;
  onQuit: (timeFocused: number, completedSession: boolean) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ isActive, task, onQuit }) => {
  const defaultDuration = (task?.estimatedTime || 25) * 60; // in seconds
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [accumulatedTime, setAccumulatedTime] = useState(0); // in seconds
  const timerRef = useRef<number | null>(null);

  // Initialize/Reset timer when task changes or overlay opens
  useEffect(() => {
    if (isActive && task) {
      const seconds = (task.estimatedTime || 25) * 60;
      setTimeLeft(seconds);
      setIsRunning(true);
      setAccumulatedTime(0);
    } else {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isActive, task]);

  // Handle countdown interval
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playTimerEndSound();
            return 0;
          }
          setAccumulatedTime((acc) => acc + 1);
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Update browser tab title with countdown status
  useEffect(() => {
    if (!isActive) return;

    const originalTitle = document.title;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (timeLeft === 0) {
      document.title = `Lock-In Done!`;
    } else {
      document.title = `[${timeFormatted}] Focus Mode | TimeToLock-In`;
    }

    return () => {
      document.title = originalTitle;
    };
  }, [isActive, timeLeft]);

  if (!isActive || !task) return null;

  const totalDuration = (task.estimatedTime || 25) * 60;
  const progressRatio = totalDuration > 0 ? timeLeft / totalDuration : 0;
  
  // SVG Ring Calculations (Radius 120 matching the 240px container)
  const radius = 120;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    playClickSound();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    playClickSound();
    setIsRunning(false);
    setTimeLeft(totalDuration);
  };

  const handleSkip = () => {
    playClickSound();
    setIsRunning(false);
    playTimerEndSound();
    setTimeLeft(0);
  };

  const handleQuit = () => {
    playClickSound();
    // Round accumulated seconds to nearest minute
    const minutesFocused = Math.round(accumulatedTime / 60) || (accumulatedTime > 30 ? 1 : 0);
    // Did they actually finish the Pomodoro timer?
    const isCompleted = timeLeft === 0;
    
    onQuit(minutesFocused, isCompleted);
  };

  return (
    <div className={`focus-overlay ${isActive ? 'active' : ''}`}>
      <div className="focus-container animate-scale">
        <div className="focus-badge">
          <Target size={14} style={{ marginRight: '6px' }} />
          <span>Focus Active</span>
        </div>

        <div className="focus-task-info">
          <h2 className="focus-task-title">{task.title}</h2>
          <span className="focus-task-category">
            Category: {task.category.toUpperCase()}
          </span>
        </div>

        {/* Circular Timer Ring */}
        <div className="timer-ring-container">
          <svg className="timer-svg" width={radius * 2} height={radius * 2}>
            <circle
              className="timer-circle-bg"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              className="timer-circle-progress"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="timer-display">
            <span className="timer-digits">{formatTime(timeLeft)}</span>
            <span className="timer-status">
              {timeLeft === 0 ? 'Locked In!' : isRunning ? 'Keep focusing' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Focus Controls */}
        <div className="focus-controls">
          <button 
            className="circle-btn reset" 
            onClick={handleReset}
            title="Reset Timer"
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            className="circle-btn play-pause" 
            onClick={handleTogglePlay}
            title={isRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isRunning ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" style={{ marginLeft: '4px' }} />}
          </button>

          {timeLeft > 0 ? (
            <button 
              className="circle-btn skip" 
              onClick={handleSkip}
              title="Force Complete Timer"
            >
              <Check size={20} />
            </button>
          ) : (
            <button 
              className="circle-btn quit" 
              onClick={handleQuit}
              title="Exit Focus Mode"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <Check size={20} />
            </button>
          )}
        </div>

        {timeLeft > 0 && (
          <button 
            className="circle-btn quit" 
            onClick={handleQuit}
            title="Exit Focus Mode"
            style={{ marginTop: '12px' }}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
