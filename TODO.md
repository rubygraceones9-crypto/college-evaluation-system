# College Evaluation System — TODO

> Categorized into **🔴 PRIORITY** (Evaluation Flow — the core pipeline), **🟠 MAJOR** (significant features), and **🟢 MINOR** (small fixes/polish).

---

## Completed (Phases 1-7)

The following items have been implemented across Phases 1-7:

- [x] **P1** Wire "Save Setup" & "Start Evaluation" to DB (Phase 1 + Phase 3 multi-group)
- [x] **P2** Fix "Create One" button route
- [x] **P3** Student-side: filter by form_type, group by period, dynamic form fetching (Phase 2)
- [x] **P4** Teacher-side: anonymous feedback & comments display
- [x] **P5** Peer-to-peer evaluation generation & dynamic form rendering (Phase 1)
- [x] **m5** Fix evaluation-setup JSX syntax error
- [x] Phase 3: Multi-group evaluation setup (multiple programs/year levels per period)
- [x] Phase 4: Academic period transition (confirmation dialog, cascade close/lock)
- [x] Phase 4: Progress bar fix (locked evals no longer inflate submitted count)
- [x] Phase 5: Just-In-Time eval generation for late registrants (`/api/evaluations/sync`)
- [x] Phase 6: Ghost evaluations (dean can anonymously evaluate teachers)
- [x] Phase 6: Row actions (Resume/Edit ghost evals, Delete ghost, Reset normal evals)
- [x] Phase 7: Fix evaluation editing (full payload on Update & Apply, redundant form_id allowed)
- [x] Fix date validation timezone bug (local date comparison instead of UTC)
- [x] Fix MySQL connection leak during HMR (globalThis pool cache)

---

## 🔴 PRIORITY — Remaining Items

### Student evaluation closed-period guard
- Student should not be able to submit when an evaluation period is closed
- The backend enforces date windows, but the frontend should also hide/disable the form

### Show course code in dean evaluation detail view
- `dean/evaluations` → View → table should show course code alongside course name

### Student evaluations: better identification
- Show detailed evaluation name for identification when multiple active evaluations exist
- Remove static "evaluation is currently active" text, make it dynamic per period

---

## 🟠 MAJOR — Significant Features

### M1. Student Dashboard data sync
- Ensure enrolled courses come from `course_enrollments`
- Show evaluation period name on dashboard

### M2. Student History module
- Fetch submitted/locked evaluations for the logged-in student
- Show past evaluation responses per course/teacher

### M3. Teacher Dashboard data sync
- Show real teaching load from courses table
- Total students not reflecting correctly in `teacher/dashboard`
- Ensure evaluation averages come from actual submitted responses

### M4. Admin Evaluation Setup — WCAG improvements
- Academic Year should be a dropdown
- Larger calendar inputs for accessibility (target user is 50+)
- Increase font sizes and button sizes

### M5. Forgot Password
- "Forgot password?" should show a modal: "Please contact the administrator/dean to reset your password."

---

## 🟢 MINOR — Small Fixes & Polish

### m1. Student Profile — Remove avatar photo
- Remove `<Avatar>` component or replace with initials display

### m2. Teacher Dashboard — No role change
- Ensure no UI element allows a teacher to switch/change their role

### m3. User dropdown — Profile & Settings working
- Verify dropdown links route correctly for each role

### m4. Login page — Verify Signup buttons
- QA test both signup flows (student + faculty) complete successfully

### Add year level and section in student signup
- Currently missing from signup form

### Teacher peer evaluation comments
- Peer-to-peer evaluation comments not getting posted/fetched/displayed correctly

### Rename "Ghost Evaluate" to "Dean Evaluate"
- Change label in dean evaluations UI

---

## Summary Matrix

| ID | Task | Status |
|----|------|--------|
| P1-P5 | Core evaluation pipeline | ✅ Done |
| m5 | Fix eval-setup JSX syntax | ✅ Done |
| Phase 3 | Multi-group setup | ✅ Done |
| Phase 4 | Academic period transitions | ✅ Done |
| Phase 5 | JIT evaluation sync | ✅ Done |
| Phase 6 | Ghost/Dean evaluations | ✅ Done |
| Phase 7 | Fix eval editing | ✅ Done |
| M1 | Student Dashboard sync | 🟡 Partial |
| M2 | Student History sync | 🔴 Pending |
| M3 | Teacher Dashboard sync | 🟡 Partial |
| M4 | WCAG improvements | 🔴 Pending |
| M5 | Forgot Password modal | 🔴 Pending |
| m1-m4 | Minor polish | 🔴 Pending |
