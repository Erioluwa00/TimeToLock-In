import React, { useState, useEffect, useRef } from 'react';
import type { Task } from '../types/task';
import { Play, Pause, RotateCcw, X, Check, Target, Volume2, Music } from 'lucide-react';
import { 
  playClickSound, 
  playTimerEndSound, 
  playZenBell, 
  playRetroChime,
  startAmbientNoise,
  stopAmbientNoise,
  updateAmbientVolume
} from './AudioSynthesizer';

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
  
  // Audio Preferences
  const [ambientType, setAmbientType] = useState<'off' | 'rain' | 'white' | 'waves'>('off');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.25);
  const [alarmType, setAlarmType] = useState<'default' | 'bell' | 'retro'>('default');

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
            playSelectedAlarm();
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

  // Handle ambient noise play state
  useEffect(() => {
    if (isActive && isRunning && ambientType !== 'off') {
      startAmbientNoise(ambientType, ambientVolume);
    } else {
      stopAmbientNoise();
    }
  }, [isActive, isRunning, ambientType]);

  // Handle ambient volume change
  useEffect(() => {
    if (isActive && isRunning && ambientType !== 'off') {
      updateAmbientVolume(ambientVolume);
    }
  }, [ambientVolume, isActive, isRunning, ambientType]);

  // Cleanup ambient audio on unmount or quit
  useEffect(() => {
    return () => {
      stopAmbientNoise();
    };
  }, []);

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

  const playSelectedAlarm = () => {
    if (alarmType === 'bell') {
      playZenBell();
    } else if (alarmType === 'retro') {
      playRetroChime();
    } else {
      playTimerEndSound();
    }
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
    playSelectedAlarm();
    setTimeLeft(0);
  };

  const handleQuit = () => {
    playClickSound();
    stopAmbientNoise();
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

        {/* Ambient Settings Panel */}
        <div className="ambient-settings glass-panel">
          <div className="settings-row">
            <div className="setting-item">
              <span className="setting-label">
                <Music size={12} style={{ marginRight: '4px' }} /> Focus Sound
              </span>
              <select 
                className="setting-select"
                value={ambientType}
                onChange={(e) => {
                  playClickSound();
                  setAmbientType(e.target.value as any);
                }}
              >
                <option value="off">Off</option>
                <option value="rain">Soft Rain</option>
                <option value="white">White Noise</option>
                <option value="waves">Ocean Waves</option>
              </select>
            </div>

            <div className="setting-item">
              <span className="setting-label">
                <Target size={12} style={{ marginRight: '4px' }} /> Alarm Tone
              </span>
              <select 
                className="setting-select"
                value={alarmType}
                onChange={(e) => {
                  playClickSound();
                  const newAlarm = e.target.value as any;
                  setAlarmType(newAlarm);
                  // Preview alarm tone
                  if (newAlarm === 'bell') playZenBell();
                  else if (newAlarm === 'retro') playRetroChime();
                  else playTimerEndSound();
                }}
              >
                <option value="default">Standard Chime</option>
                <option value="bell">Zen Bell</option>
                <option value="retro">Retro Triplet</option>
              </select>
            </div>
          </div>

          {ambientType !== 'off' && (
            <div className="volume-slider-container">
              <Volume2 size={13} style={{ color: 'var(--text-secondary)' }} />
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                className="volume-slider"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(Number(e.target.value))}
                title="Ambient Volume"
              />
            </div>
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
