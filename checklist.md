# TimeToLock-In Checklist & Requirements

Welcome to **TimeToLock-In**, your modern, interactive, and gamified personal task manager. Below is the list of all requirements and features we have built for the application.

## 1. Core Data & Persistence
- [x] **TypeScript Typings (`src/types/task.ts`)**: Define clear types for:
  - `Task`: ID, title, priority (`'low' | 'medium' | 'high'`), category (with icon and color), deadline (optional), completed status, created date, and Focus Mode tracking.
  - `DailyStreak`: Current streak count, last active date (to compute streaks correctly).
  - `SubTask`: ID, title, completed status.
- [x] **Local Storage Hook (`src/hooks/useLocalStorage.ts`)**: Generic hook for persisting and retrieving tasks, theme settings, and streaks.
- [x] **Streak Tracker Logic**:
  - Automatically calculate streaks upon completing a task.
  - Timezone-safe calculations using local offsets.
  - Maintain a persistent counter in Local Storage.

---

## 2. User Interface & Layout (Normal CSS, no Tailwind)
- [x] **Global CSS (`src/index.css`)**:
  - CSS variables for theme-specific colors (Light, Dark, Purple, Forest, Ocean, Sunset).
  - Modern typography using Google Fonts (Outfit & Inter).
  - Flat, solid-color styling system.
- [x] **Custom Theme Provider & Context**:
  - Theme switching logic with animated transitions.
  - Dynamic visual response when changing themes.
- [x] **Responsive Navigation & Sidebar / Header**:
  - Beautiful sidebar for filtering and statistics (collapsible on mobile).
  - Header featuring the stopwatch crosshair SVG logo and responsive stats pills.
  - Integrated mobile menu hamburger trigger inside Header navbar.

---

## 3. Task Management & Operations
- [x] **Task Creation Modal / Drawer**:
  - Floating modal card.
  - Forms for Task Title, Priority Selector, Category Selector, Deadline, and Estimated Focus Time.
  - Form field to add checklist subtasks dynamically.
- [x] **Task List / Card Components**:
  - Spaced out, rounded cards with min-height: 140px for visibility.
  - Nested, collapsible checklist subtasks.
  - Quick action buttons (Edit, Delete, Complete, Start Lock-in).
  - Visual distinction for completed tasks (line-through, opacity change).
- [x] **Real-time Search & Filters**:
  - Instant text filter by task title.
  - Tab filters: All, Active, Completed, High Priority, Due Today.
  - Sidebar categories filter.

---

## 4. Gamification & Polish (The "Fun" Elements)
- [x] **Daily Progress Tracker**:
  - Segmented visual progress bar showing completion rate.
  - Motivational messages based on completion.
- [x] **Streak Counter & Badges**:
  - Display streak count with fire icon (e.g., `🔥 1`).
  - Motivational quotes text based on progress.
- [x] **Satisfying Completions**:
  - Pop a colorful confetti particle burst using `canvas-confetti`.
  - Dynamic slide animations for completed tasks.
  - Synthesized audio confirmation chime via the HTML5 Web Audio API.

---

## 5. Focus Mode ("Lock-In")
- [x] **Focus Interface Overlay**:
  - Visual fade out of all background tasks with theme-responsive backgrounds.
  - Bold, prominent display of the active task.
  - Settings panel for Ambient Sound loops (Rain, White Noise, Ocean Waves) and Custom Alarm select (Zen Bell, Retro Triplet, Standard Chime).
- [x] **Pomodoro Timer**:
  - configurable countdown clock (minutes * 60).
  - Visual circle progress bar indicating time remaining.
  - Sound chime & screen flash when the focus session completes.

---

## 6. Drag & Drop Organization
- [x] **Interactive Reordering**:
  - Lightweight, native HTML5 drag-and-drop system.
  - Reorder items within the active task list.

---

## 7. Branding & PWA Capabilities
- [x] **Application Logo**:
  - SVG Vector implementation in the UI.
- [x] **PWA Configuration**:
  - Service Worker registration in `src/main.tsx`.
  - Web manifest configuration with responsive SVG maskable icon assets in `vite.config.ts`.
  - Offline accessibility, standalone view, and custom status bar colors.
