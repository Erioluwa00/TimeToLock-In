# TimeToLock-In Checklist & Requirements

Welcome to **TimeToLock-In**, your modern, interactive, and gamified personal task manager. Below is the list of all requirements and features we will build for the application, broken down by category. We will use this checklist to track our implementation progress.

## 1. Core Data & Persistence
- [ ] **TypeScript Typings (`src/types/task.ts`)**: Define clear types for:
  - `Task`: ID, title, priority (`'low' | 'medium' | 'high'`), category (with icon and color), deadline (optional), completed status, created date, and Focus Mode tracking.
  - `DailyStreak`: Current streak count, last active date (to compute streaks correctly).
- [ ] **Local Storage Hook (`src/hooks/useLocalStorage.ts`)**: Generic hook for persisting and retrieving tasks, theme settings, and streaks.
- [ ] **Streak Tracker Logic**:
  - Automatically calculate streaks upon completing a task.
  - Maintain a persistent counter in Local Storage.

---

## 2. User Interface & Layout (Normal CSS, no Tailwind)
- [ ] **Global CSS (`src/index.css`)**:
  - CSS variables for theme-specific colors (Light, Dark, Purple, Forest, Ocean, Sunset).
  - Modern typography using Google Fonts (Outfit & Inter).
  - High-end visual styles: smooth gradients, glassmorphic card styles, rich drop shadows, and rounded corners.
- [ ] **Custom Theme Provider & Context**:
  - Theme switching logic with animated transitions.
  - Dynamic visual response when changing themes.
- [ ] **Responsive Navigation & Sidebar / Header**:
  - Beautiful sidebar for filtering and statistics (collapsible on mobile).
  - Header featuring the application logo (SVG) and user greeting ("Good afternoon 👋").

---

## 3. Task Management & Operations
- [ ] **Task Creation Modal / Drawer**:
  - A slide-in drawer or floating card (no massive modals).
  - Forms for Task Title, Priority Selector, Category Selector, and Deadline.
- [ ] **Task List / Card Components**:
  - Spaced out, rounded cards.
  - Quick action buttons (Edit, Delete, Complete, Start Lock-in).
  - Visual distinction for completed tasks (line-through, opacity change).
- [ ] **Real-time Search & Filters**:
  - Instant text filter by task title.
  - Tab filters: All, Active, Completed, High Priority, Due Today.
  - Sidebar categories filter.

---

## 4. Gamification & Polish (The "Fun" Elements)
- [ ] **Daily Progress Tracker**:
  - Segmented visual progress bar showing completion rate (e.g., `████████░░ 80%`).
  - Motivational messages based on completion (e.g., "Great job today! 🎉").
- [ ] **Streak Counter & Badges**:
  - Display streak count with fire icon (e.g., `🔥 5 day streak`).
  - Motivational quotes carousel (e.g., "Small progress is still progress.").
- [ ] **Satisfying Completions**:
  - Pop a colorful confetti particle burst using `canvas-confetti`.
  - Dynamic slide animations for completed tasks.
  - Synthesized audio confirmation chime via the HTML5 Web Audio API (no external file dependencies).

---

## 5. Focus Mode ("Lock-In")
- [ ] **Focus Interface Overlay**:
  - Visual fade out of all background tasks.
  - Bold, prominent display of the active task.
- [ ] **Pomodoro Timer**:
  - 25-minute countdown clock (configurable).
  - Visual circle progress bar indicating time remaining.
  - Sound chime & screen flash when the focus session completes.

---

## 6. Drag & Drop Organization
- [ ] **Interactive Reordering**:
  - Lightweight, native HTML5 drag-and-drop system.
  - Reorder items within the active task list.
  - Drag tasks directly to categories or completion states.

---

## 7. Branding & Asset Assets
- [ ] **Application Logo**:
  - SVG Vector implementation in the UI.
  - PNG logo asset for PWA/icons.
