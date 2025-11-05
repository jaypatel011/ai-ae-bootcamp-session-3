# Product Requirements Document (PRD) - TODO App Enhancement

## 1. Overview

We are upgrading the basic TODO app to support due dates, priorities, and intelligent filtering. These enhancements enable users to better organize, prioritize, and manage their tasks without adding unnecessary complexity. The focus is on practical deadline and priority management features that make the app more useful for everyday task tracking.

---

## 2. MVP Scope

- **Add Due Date Field**: Optional ISO `YYYY-MM-DD` format field for each task to set deadlines
- **Priority System**: Add priority levels with three options: `P1`, `P2`, `P3` (default: `P3`)
- **Filter Views**: Implement three filter tabs:
  - **All**: Display all tasks including completed ones
  - **Today**: Show only incomplete tasks due today
  - **Overdue**: Show only incomplete overdue tasks
- **Local Storage**: Store all task data locally (no backend changes required)
- **Data Validation**: Implement validation for:
  - `title`: Required field
  - `priority`: Enum of `"P1"` | `"P2"` | `"P3"` (default `"P3"`)
  - `dueDate`: Optional ISO `YYYY-MM-DD` format; invalid values are ignored (treated as absent)

---

## 3. Post-MVP Scope

- **Visual Highlighting for Overdue Tasks**: Apply red highlighting/styling to overdue tasks for quick visual identification
- **Advanced Sorting Logic**: Implement multi-level sorting with the following priority:
  1. Overdue tasks appear first
  2. Then sort by priority level (P1 → P2 → P3)
  3. Then sort by due date in ascending order
  4. Tasks without due dates appear last

---

## 4. Out of Scope

- Notifications (email, push, or in-app alerts)
- Recurring/repeating tasks
- Multi-user functionality
- Keyboard navigation and advanced accessibility features
- External storage or backend persistence
- Task descriptions or additional metadata fields (beyond title, priority, and due date)

