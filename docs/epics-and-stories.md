# Epics and Stories - TODO App Enhancement

## MVP

### Epic: Due Date Management
- Story: Add due date field to task model
  - Acceptance Criteria:
    - Task model includes an optional `dueDate` field
    - `dueDate` is stored in ISO `YYYY-MM-DD` format
    - Invalid date values are treated as absent
  - Technical Requirements:
    - Backend: Add `due_date DATE` nullable column to tasks table (SQLite)
    - Backend: Validate date format in POST/PUT endpoints; reject invalid dates with 400 error
    - Frontend: Store due_date as string in state (YYYY-MM-DD format)
    - Frontend: Use TaskForm component with TextField type="date" for date input
    - Current Implementation: Backend stores as DATE in SQLite; Frontend normalizes dates via `normalizeDateString()` helper

- Story: Implement due date input in task form
  - Acceptance Criteria:
    - Task form includes a due date input field
    - Input field accepts ISO `YYYY-MM-DD` format
    - Due date field is optional (not required)
  - Technical Requirements:
    - Frontend: TaskForm.js must include `<TextField type="date">` component with id="task-due-date"
    - Frontend: Use dueDate state variable; initialize from initialTask.due_date or empty string
    - Frontend: Convert browser date input to ISO string format before sending to API
    - Frontend: Include InputLabelProps={{ shrink: true }} to prevent label overlap
    - Current Implementation: TaskForm.js lines 65-78 implement date input with normalization

- Story: Display due date on task list items
  - Acceptance Criteria:
    - Task list displays the due date when present
    - Tasks without due dates show no date display
    - Due date is clearly visible and readable
  - Technical Requirements:
    - Frontend: TaskList.js must implement `formatDueDate()` function to convert YYYY-MM-DD to readable format
    - Frontend: Use MUI Chip component with EventIcon to display due date (orange styling per UI guidelines)
    - Frontend: Conditionally render date chip only if task.due_date exists
    - Frontend: Parse date as local date (not UTC) to avoid timezone offset issues
    - Current Implementation: TaskList.js lines 19-28 format dates; lines 91-103 render with Chip component

- Story: Validate due date format (ISO YYYY-MM-DD)
  - Acceptance Criteria:
    - Only ISO `YYYY-MM-DD` format is accepted
    - Invalid date formats are ignored
    - Invalid dates are treated as absent/null
  - Technical Requirements:
    - Frontend: TaskForm.js `normalizeDateString()` validates regex /^\d{4}-\d{2}-\d{2}$/ for ISO format
    - Frontend: Invalid dates silently set to empty string (no error thrown to user)
    - Backend: Store null for empty/missing due_date values in database
    - Backend: No validation error for invalid dates; treat as null for backward compatibility
    - Current Implementation: TaskForm.js lines 24-35 implement regex validation and normalization

### Epic: Priority System
- Story: Add priority field to task model with P1, P2, P3 levels
  - Acceptance Criteria:
    - Task model includes a `priority` field
    - Priority accepts only three values: `P1`, `P2`, `P3`
    - Default priority is `P3`
  - Technical Requirements:
    - Backend: Add `priority TEXT DEFAULT 'P3'` column to tasks table (SQLite)
    - Backend: Validate priority enum values (P1, P2, P3) in POST/PUT endpoints; reject invalid with 400 error
    - Frontend: Store priority as string in state variable
    - Frontend: Maintain default value of 'P3' when creating new tasks
    - Current Implementation: Backend has column defined; Frontend needs implementation

- Story: Implement priority selector in task form
  - Acceptance Criteria:
    - Task form includes a priority selector
    - Selector offers options: `P1`, `P2`, `P3`
    - Default selection is `P3`
  - Technical Requirements:
    - Frontend: TaskForm.js must include priority state variable initialized to 'P3'
    - Frontend: Use MUI Select component with MenuItem options for P1, P2, P3
    - Frontend: Include priority in form submission payload
    - Frontend: Initialize from initialTask.priority when editing, or 'P3' when creating
    - Current Implementation: Not yet implemented in TaskForm.js

- Story: Display priority indicator on task list items
  - Acceptance Criteria:
    - Task list displays priority level for each task
    - Priority indicator is clearly distinguishable
    - All three priority levels are visually identifiable
  - Technical Requirements:
    - Frontend: TaskList.js must render priority indicator for each task
    - Frontend: Use distinct visual styling per UI guidelines (color or badge system)
    - Frontend: Consider MUI Chip or Badge component for priority display
    - Frontend: Position priority indicator alongside other task metadata (near due date)
    - Current Implementation: Not yet implemented in TaskList.js

- Story: Set default priority to P3
  - Acceptance Criteria:
    - New tasks default to `P3` priority
    - Default applies when priority is not explicitly set
    - Existing tasks retain their assigned priority
  - Technical Requirements:
    - Backend: Database column default value of 'P3' ensures new records default correctly
    - Backend: POST endpoint should not require priority in request body; uses default
    - Frontend: TaskForm initializes priority state to 'P3' for new tasks
    - Current Implementation: Backend default set in schema; Frontend needs state initialization

### Epic: Filter Views
- Story: Create All tasks filter tab
  - Acceptance Criteria:
    - Filter tab displays all tasks including completed ones
    - Tab is labeled "All"
    - Filter is accessible and clearly marked
  - Technical Requirements:
    - Frontend: Add tab navigation component (MUI Tabs) above TaskList
    - Frontend: "All" tab should fetch tasks without completed filter parameter
    - Backend: GET /api/tasks endpoint already supports filtering; omit completed query param for "All"
    - Frontend: Store activeFilter state to track selected tab
    - Current Implementation: TaskList fetches all tasks; tab navigation not yet implemented

- Story: Create Today filter tab (incomplete tasks due today)
  - Acceptance Criteria:
    - Filter shows only incomplete tasks
    - Displays only tasks due today (matching today's date)
    - Tab is labeled "Today"
  - Technical Requirements:
    - Frontend: Add "Today" tab button in tab navigation
    - Frontend: Calculate today's date in YYYY-MM-DD format
    - Frontend: Filter tasks client-side: completed === false AND due_date === today
    - Backend: Optional - could add server-side filtering, but client-side sufficient for MVP
    - Current Implementation: Not yet implemented

- Story: Create Overdue filter tab (incomplete overdue tasks)
  - Acceptance Criteria:
    - Filter shows only incomplete tasks
    - Displays only tasks with due dates in the past
    - Tab is labeled "Overdue"
  - Technical Requirements:
    - Frontend: Add "Overdue" tab button in tab navigation
    - Frontend: Filter tasks client-side: completed === false AND due_date < today
    - Frontend: Parse due_date strings for date comparison
    - Backend: Optional - could add server-side filtering
    - Current Implementation: Not yet implemented

- Story: Implement filter tab navigation
  - Acceptance Criteria:
    - Three filter tabs are available and clickable
    - Switching tabs updates the task list display
    - Current active tab is clearly indicated
  - Technical Requirements:
    - Frontend: Use MUI Tabs and Tab components for navigation
    - Frontend: Implement onClick handlers for each tab to set activeFilter state
    - Frontend: Pass filtered task list to TaskList component based on activeFilter
    - Frontend: Apply visual styling to indicate active tab (standard MUI behavior)
    - Frontend: Position tabs above TaskList, likely in a new component or within App.js
    - Current Implementation: Not yet implemented; App.js structure ready for tab integration

### Epic: Local Storage
- Story: Persist task data to local storage
  - Acceptance Criteria:
    - All task data is saved to browser's local storage
    - Data persists after page refresh
    - Data persists after browser restart
  - Technical Requirements:
    - Frontend: After successful API calls (POST, PUT, DELETE), persist entire tasks array to localStorage
    - Frontend: Use `localStorage.setItem('tasks', JSON.stringify(tasks))` to serialize tasks
    - Frontend: Add localStorage update logic in TaskForm.js onSave callback and TaskList.js after fetch
    - Frontend: Store complete task objects including id, title, description, due_date, completed, priority
    - Note: Current implementation uses backend API; localStorage adds offline capability as backup
    - Current Implementation: Backend uses in-memory SQLite; localStorage not yet implemented

- Story: Load task data from local storage on app startup
  - Acceptance Criteria:
    - App loads tasks from local storage on initialization
    - Loaded tasks are displayed in the task list
    - App functions correctly if local storage is empty
  - Technical Requirements:
    - Frontend: On App.js mount, check if localStorage contains tasks before fetching from API
    - Frontend: Implement `useEffect` hook to load from localStorage on component initialization
    - Frontend: Use `JSON.parse(localStorage.getItem('tasks'))` to deserialize tasks
    - Frontend: Fall back to empty array if localStorage is empty or parsing fails
    - Frontend: Prefer API data over localStorage if both available (API is source of truth)
    - Current Implementation: Not yet implemented

- Story: Clear local storage when needed
  - Acceptance Criteria:
    - Tasks can be deleted from local storage
    - Local storage updates when tasks are added/modified/deleted
    - All storage operations complete without errors
  - Technical Requirements:
    - Frontend: Update localStorage after every mutation (add, edit, delete, toggle complete)
    - Frontend: On task deletion, remove from localStorage array and re-serialize
    - Frontend: Implement error handling for localStorage quota exceeded scenario
    - Frontend: Consider localStorage.removeItem('tasks') for clearing all tasks if needed
    - Current Implementation: Not yet implemented

### Epic: Data Validation
- Story: Validate title is required
  - Acceptance Criteria:
    - Title field is marked as required
    - Form cannot be submitted without a title
    - Error message displays if title is empty
  - Technical Requirements:
    - Frontend: TaskForm.js must validate title before handleSubmit (line 54: `if (!title.trim())`)
    - Frontend: Set error state with "Title is required" message
    - Frontend: Display error message in Typography component with color="error"
    - Frontend: Disable form submission if title is empty or whitespace only
    - Backend: app.js POST/PUT endpoints validate title; return 400 error if missing or empty (lines 90-91, 124-125)
    - Current Implementation: Frontend validation at TaskForm.js lines 53-56; Backend at app.js lines 90-91, 124-125

- Story: Validate priority is valid enum value
  - Acceptance Criteria:
    - Only `P1`, `P2`, `P3` are accepted as priority values
    - Invalid priority values are rejected
    - Default `P3` is applied when invalid value provided
  - Technical Requirements:
    - Backend: Add validation in POST/PUT endpoints to check priority against ['P1', 'P2', 'P3']
    - Backend: Return 400 error if priority not in valid enum
    - Frontend: TaskForm.js Select component restricted to P1, P2, P3 options (UI-level validation)
    - Frontend: Fallback to 'P3' if priority prop is missing or invalid
    - Current Implementation: Not yet implemented in validation

- Story: Validate due date format and ignore invalid values
  - Acceptance Criteria:
    - Only ISO `YYYY-MM-DD` format is accepted
    - Invalid date formats are ignored/treated as absent
    - No error thrown for invalid dates (silent failure)
  - Technical Requirements:
    - Frontend: TaskForm.js `normalizeDateString()` function validates ISO format with regex
    - Frontend: Invalid dates silently convert to empty string (no user error message)
    - Frontend: Send null to backend if due_date is empty string
    - Backend: Accept null for due_date field; store as NULL in database
    - Backend: No validation error for date format; silent rejection (backward compatible)
    - Current Implementation: Frontend at TaskForm.js lines 24-35; Backend accepts null silently

---

## Post-MVP

### Epic: Visual Enhancements
- Story: Apply red highlighting to overdue tasks
  - Acceptance Criteria:
    - Overdue tasks display with red highlighting/styling
    - Red styling is applied only to overdue incomplete tasks
    - Styling is visually distinct from other tasks
  - Technical Requirements:
    - Frontend: TaskList.js must calculate if task is overdue (due_date < today AND completed === false)
    - Frontend: Modify ListItem sx styling to apply red background/border for overdue tasks
    - Frontend: Use color from UI guidelines (e.g., #f44336 or #d32f2f for red)
    - Frontend: Consider red border or red badge instead of/in addition to background
    - Current Implementation: TaskList.js has conditional styling for completed tasks; needs overdue logic added

- Story: Add visual indicators for different priority levels
  - Acceptance Criteria:
    - Each priority level (P1, P2, P3) has a distinct visual indicator
    - Indicators are consistent across all tasks
    - Visual indicators are clear and accessible
  - Technical Requirements:
    - Frontend: TaskList.js must render priority indicator for each task
    - Frontend: Define color scheme for priorities: P1 (red/urgent), P2 (orange/medium), P3 (gray/low)
    - Frontend: Use MUI Chip, Badge, or colored icon to display priority
    - Frontend: Position priority indicator near due date chip or as task list sidebar
    - Current Implementation: Not yet implemented

### Epic: Advanced Sorting
- Story: Sort overdue tasks to appear first
  - Acceptance Criteria:
    - Overdue tasks are sorted to the top of the list
    - Only applies to incomplete tasks
    - Sorting works with all filter views
  - Technical Requirements:
    - Frontend: TaskList.js must calculate overdue status for each task during render
    - Frontend: Sort tasks array: overdue incomplete tasks first, then others
    - Frontend: Define "overdue" as: due_date < today AND completed === false
    - Backend: Optional - could implement in SQL query, but client-side sufficient
    - Current Implementation: Backend SQL sorts by due_date; overdue sorting not yet implemented

- Story: Sort tasks by priority level (P1 → P2 → P3)
  - Acceptance Criteria:
    - Within each time group, tasks are sorted P1 first, then P2, then P3
    - All tasks respect priority ordering
    - Sorting is consistent across views
  - Technical Requirements:
    - Frontend: TaskList.js must apply secondary sort by priority after date sorting
    - Frontend: Map priority strings to sort order: P1=1, P2=2, P3=3
    - Frontend: Use stable sort to maintain order within same priority
    - Backend: Optional - could add priority to SQL ORDER BY clause
    - Current Implementation: Not yet implemented

- Story: Sort tasks by due date in ascending order
  - Acceptance Criteria:
    - Tasks with earlier due dates appear before later due dates
    - Sorting applies after priority sorting
    - Tasks are ordered soonest to latest
  - Technical Requirements:
    - Backend: app.js GET endpoint uses SQL ORDER BY due_date IS NULL, due_date ASC (line 56)
    - Frontend: TaskList.js receives pre-sorted data from API
    - Frontend: Optional client-side re-sorting if local storage used without backend
    - Current Implementation: Backend already implements via SQL; TaskList receives sorted data

- Story: Place tasks without due dates last
  - Acceptance Criteria:
    - Tasks without due dates appear at the end of the list
    - This applies after all other sorting criteria
    - No due date tasks are grouped together
  - Technical Requirements:
    - Backend: SQL uses `due_date IS NULL` as first sort criterion to push nulls to end (line 56)
    - Frontend: Respects backend sort order
    - Note: SQLite sorts NULLs last by default with `ORDER BY col IS NULL`
    - Current Implementation: Backend already implements via SQL
