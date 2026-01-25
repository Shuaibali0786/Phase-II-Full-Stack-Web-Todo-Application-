# Tasks: Dashboard UX Polish

**Input**: Design documents from `/specs/master/`
**Prerequisites**: plan-ux-polish.md (required), spec.md (Session 2026-01-23 clarifications), research-ux-polish.md, quickstart-ux-polish.md

**Tests**: Not explicitly requested - focusing on visual validation and manual testing

**Organization**: Tasks are grouped by implementation area (navbar, buttons, table, modals) for logical execution order.

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- Web app structure: `frontend/src/app/` for pages, `frontend/src/app/components/` for components

---

## Phase 1: Setup & Validation

**Purpose**: Ensure development environment ready and baseline documented

- [ ] T001 Verify frontend development environment running (`npm run dev` in frontend/ directory)
- [ ] T002 [P] Take screenshots of current dashboard UI (navbar, buttons, table hover, modals) for before/after comparison
- [ ] T003 [P] Document current animation behavior in test notes (scale effects, shadow effects, modal slide)

**Checkpoint**: Environment ready, baseline documented for regression testing

---

## Phase 2: Navbar Layout Restructuring

**Purpose**: Center "Add Task" button between Logo (left) and Logout (right), remove user identification

**File**: `frontend/src/app/dashboard/page.tsx`

- [ ] T004 Update navbar header layout from justify-between to three-section flex layout (lines ~129-156 in frontend/src/app/dashboard/page.tsx)
- [ ] T005 Wrap Logo in `<div className="flex-1">` for left section in frontend/src/app/dashboard/page.tsx
- [ ] T006 Wrap "Add Task" button in plain `<div>` for center section in frontend/src/app/dashboard/page.tsx
- [ ] T007 Wrap Logout button in `<div className="flex-1 flex justify-end">` for right section in frontend/src/app/dashboard/page.tsx
- [ ] T008 Verify no username/welcome text displayed in navbar (should already be removed per spec)
- [ ] T009 Visual validation: Add Task button centered between Logo and Logout on desktop/tablet/mobile

**Checkpoint**: Navbar layout complete - centered primary action with clean visual hierarchy

---

## Phase 3: Button Animation Simplification

**Purpose**: Remove scale/shadow effects, keep only color transitions for professional minimal feel

**File**: `frontend/src/app/components/ui/Button.tsx`

- [ ] T010 [P] Locate all button variant definitions in frontend/src/app/components/ui/Button.tsx
- [ ] T011 [P] Remove all `hover:scale-*` classes from button variants in frontend/src/app/components/ui/Button.tsx
- [ ] T012 [P] Remove all `active:scale-*` classes from button variants in frontend/src/app/components/ui/Button.tsx
- [ ] T013 [P] Remove all `shadow-*` and `hover:shadow-*` classes from button variants in frontend/src/app/components/ui/Button.tsx
- [ ] T014 [P] Add `transition-colors duration-200` to each button variant in frontend/src/app/components/ui/Button.tsx
- [ ] T015 Verify primary button hover: bg-orange-500 → bg-orange-600 (color only, no scale/shadow)
- [ ] T016 Verify ghost button hover: bg-transparent → bg-gray-800 (color only, no scale/shadow)
- [ ] T017 Visual validation: All buttons respond to hover with smooth color transition (200ms), no size change

**Checkpoint**: Button animations simplified - minimal, professional hover feedback

---

## Phase 4: Table Row Hover Refinement

**Purpose**: Remove scale effect from table row hover, keep only background tint

**File**: `frontend/src/app/components/TaskTable/TableRow.tsx`

- [ ] T018 Locate `whileHover` prop in motion.tr element (lines ~88-98 in frontend/src/app/components/TaskTable/TableRow.tsx)
- [ ] T019 Remove `scale: 1.005` property from whileHover object in frontend/src/app/components/TaskTable/TableRow.tsx
- [ ] T020 Keep only `backgroundColor: 'rgba(31, 41, 55, 0.4)'` and `transition: { duration: 0.2 }` in whileHover
- [ ] T021 Visual validation: Table rows show subtle gray background tint on hover, no scale/layout shift

**Checkpoint**: Table row hover refined - clean background tint feedback only

---

## Phase 5: Modal Animation Simplification

**Purpose**: Replace slide/scale animations with fade-only transitions for modals

### Base Modal Component

**File**: `frontend/src/app/components/ui/Modal.tsx`

- [ ] T022 Locate Framer Motion animation props in Modal component (frontend/src/app/components/ui/Modal.tsx)
- [ ] T023 Replace `initial` prop with `{ opacity: 0 }` (remove any y, scale properties) in frontend/src/app/components/ui/Modal.tsx
- [ ] T024 Replace `animate` prop with `{ opacity: 1 }` (remove any y, scale properties) in frontend/src/app/components/ui/Modal.tsx
- [ ] T025 Replace `exit` prop with `{ opacity: 0 }` (remove any y, scale properties) in frontend/src/app/components/ui/Modal.tsx
- [ ] T026 Update `transition` prop to `{ duration: 0.2, ease: 'easeOut' }` in frontend/src/app/components/ui/Modal.tsx
- [ ] T027 Visual validation: Base modal fades in/out smoothly (200ms), no slide or scale effects

### TaskFormModal

**File**: `frontend/src/app/components/TaskForm/TaskFormModal.tsx`

- [ ] T028 Verify TaskFormModal uses base Modal component (check imports in frontend/src/app/components/TaskForm/TaskFormModal.tsx)
- [ ] T029 If TaskFormModal has custom animations, apply same fade-only changes (remove y, scale from initial/animate/exit)
- [ ] T030 Visual validation: TaskFormModal opens/closes with fade-only animation when clicking "Add Task" or "Edit"

### DeleteConfirmationModal

**File**: `frontend/src/app/components/common/DeleteConfirmationModal.tsx`

- [ ] T031 Verify DeleteConfirmationModal uses base Modal component (check imports in frontend/src/app/components/common/DeleteConfirmationModal.tsx)
- [ ] T032 If DeleteConfirmationModal has custom animations, apply same fade-only changes (remove y, scale from initial/animate/exit)
- [ ] T033 Visual validation: DeleteConfirmationModal opens/closes with fade-only animation when clicking delete button

**Checkpoint**: All modals use fade-only animations - consistent, professional modal experience

---

## Phase 6: Animation Utilities Review (Optional)

**Purpose**: Update shared animation utilities if they exist

**File**: `frontend/src/lib/animations.ts` (if exists)

- [ ] T034 Check if frontend/src/lib/animations.ts file exists
- [ ] T035 If animations.ts exists and contains modal-specific variants, update them to fade-only (remove y, scale properties)
- [ ] T036 Preserve page-level animations like fadeInUp for dashboard sections (these are appropriate for content loading)

**Checkpoint**: Animation utilities updated or confirmed not needed

---

## Phase 7: Comprehensive Testing & Validation

**Purpose**: Ensure all changes work correctly across browsers, devices, and accessibility tools

### Visual Testing

- [ ] T037 [P] Test navbar layout: Add Task centered between Logo and Logout on desktop (1920x1080)
- [ ] T038 [P] Test navbar layout: responsive behavior on tablet (768px)
- [ ] T039 [P] Test navbar layout: responsive behavior on mobile (375px)
- [ ] T040 [P] Test button hover: primary button color transition (no scale/shadow)
- [ ] T041 [P] Test button hover: ghost button color transition (no scale/shadow)
- [ ] T042 [P] Test button hover: all action buttons in table (edit, delete) color transition only
- [ ] T043 [P] Test table row hover: background tint appears smoothly (no scale effect)
- [ ] T044 [P] Test TaskFormModal animation: fade-in when opening (no slide/scale)
- [ ] T045 [P] Test TaskFormModal animation: fade-out when closing (no slide/scale)
- [ ] T046 [P] Test DeleteConfirmationModal animation: fade-in/out (no slide/scale)

### Interaction Testing

- [ ] T047 [P] Test navbar: "Add Task" button clickable, opens TaskFormModal correctly
- [ ] T048 [P] Test navbar: Logout button clickable, logs out user
- [ ] T049 [P] Test table: checkbox toggles completion status
- [ ] T050 [P] Test table: edit button opens TaskFormModal with task data
- [ ] T051 [P] Test table: delete button opens DeleteConfirmationModal
- [ ] T052 [P] Test modals: backdrop click closes modal
- [ ] T053 [P] Test modals: Esc key closes modal

### Keyboard Navigation Testing

- [ ] T054 Test Tab order: Logo → Add Task → Logout → table elements (logical flow)
- [ ] T055 Test focus indicators: all buttons show visible focus ring/outline
- [ ] T056 Test Esc key: closes open modals correctly
- [ ] T057 Test Enter key: activates focused buttons
- [ ] T058 Test Space key: toggles checkboxes in table

### Screen Reader Testing

- [ ] T059 Test with screen reader (NVDA/JAWS/VoiceOver): Logo has appropriate identification
- [ ] T060 Test with screen reader: buttons announce clear labels (not just icons)
- [ ] T061 Test with screen reader: icon-only buttons have proper aria-label
- [ ] T062 Test with screen reader: modals announce role="dialog" and aria-modal="true"
- [ ] T063 Test with screen reader: table structure properly announced

### Cross-Browser Testing

- [ ] T064 [P] Test in Chrome (latest): all features work, animations smooth
- [ ] T065 [P] Test in Firefox (latest): all features work, animations smooth
- [ ] T066 [P] Test in Safari (latest): all features work, animations smooth
- [ ] T067 [P] Test in Edge (latest): all features work, animations smooth

### Performance Validation

- [ ] T068 Run Chrome DevTools Lighthouse audit: verify no performance regressions
- [ ] T069 Test interaction response time: button hover feels instant (<50ms perceived)
- [ ] T070 Test modal animations: smooth 60fps (use Performance tab in DevTools)

**Checkpoint**: All tests pass - UX polish complete and validated

---

## Phase 8: Documentation & Cleanup

**Purpose**: Document changes and prepare for deployment

- [ ] T071 Take screenshots of updated dashboard UI (navbar, buttons, table, modals) for documentation
- [ ] T072 [P] Create before/after comparison document showing UX improvements
- [ ] T073 [P] Update any relevant component documentation or Storybook stories (if they exist)
- [ ] T074 Verify all modified files are staged for commit
- [ ] T075 Review git diff to ensure no unintended changes
- [ ] T076 Run quickstart-ux-polish.md validation checklist one final time

**Checkpoint**: Changes documented and ready for code review/deployment

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 (Setup)**: No dependencies - start immediately
2. **Phase 2 (Navbar)**: Depends on Phase 1 setup
3. **Phase 3 (Buttons)**: Can run in parallel with Phase 2 (different file)
4. **Phase 4 (Table)**: Can run in parallel with Phase 2-3 (different file)
5. **Phase 5 (Modals)**: Can run in parallel with Phase 2-4 (different files)
6. **Phase 6 (Utilities)**: Optional, can run in parallel with Phase 2-5
7. **Phase 7 (Testing)**: Depends on completion of Phases 2-6
8. **Phase 8 (Documentation)**: Depends on Phase 7 completion

### Sequential Execution (Single Developer)

**Recommended Order**:
1. Phase 1: Setup (T001-T003)
2. Phase 2: Navbar (T004-T009)
3. Phase 3: Buttons (T010-T017)
4. Phase 4: Table (T018-T021)
5. Phase 5: Modals (T022-T033)
6. Phase 6: Utilities (T034-T036) - if needed
7. Phase 7: Testing (T037-T070)
8. Phase 8: Documentation (T071-T076)

### Parallel Execution (Multiple Developers or Parallel Tool Use)

**After Phase 1 Setup**, the following can run in parallel:

**Parallel Group A** (Implementation):
- Phase 2: Navbar (T004-T009)
- Phase 3: Buttons (T010-T017)
- Phase 4: Table (T018-T021)
- Phase 5: Modals (T022-T033)
- Phase 6: Utilities (T034-T036)

**Parallel Group B** (After Group A completes - Testing):
- All visual tests (T037-T046)
- All interaction tests (T047-T053)
- All browser tests (T064-T067)

---

## Parallel Example: Implementation Phase

```bash
# After completing Phase 1 Setup, launch all implementation tasks in parallel:

# Developer/Agent A: Navbar
Task: "Update navbar header layout..." (T004)
Task: "Wrap Logo in flex-1..." (T005)
# ... continues with T006-T009

# Developer/Agent B: Buttons
Task: "Locate button variants..." (T010)
Task: "Remove hover:scale-*..." (T011)
# ... continues with T012-T017

# Developer/Agent C: Table
Task: "Locate whileHover prop..." (T018)
Task: "Remove scale property..." (T019)
# ... continues with T020-T021

# Developer/Agent D: Modals
Task: "Locate animation props in Modal..." (T022)
Task: "Replace initial prop..." (T023)
# ... continues with T024-T033
```

---

## Parallel Example: Testing Phase

```bash
# After implementation complete, launch all visual tests together:
Task: "Test navbar layout on desktop" (T037)
Task: "Test navbar layout on tablet" (T038)
Task: "Test navbar layout on mobile" (T039)
Task: "Test button hover primary" (T040)
Task: "Test button hover ghost" (T041)
# ... etc.

# Launch all browser tests together:
Task: "Test in Chrome" (T064)
Task: "Test in Firefox" (T065)
Task: "Test in Safari" (T066)
Task: "Test in Edge" (T067)
```

---

## Implementation Strategy

### Focused Approach (Recommended)

1. **Phase 1**: Setup and baseline documentation (15 min)
2. **Phases 2-6**: Implementation in sequence (1.5-2 hours)
   - Navbar → Buttons → Table → Modals → Utilities
   - Test visually after each phase for immediate feedback
3. **Phase 7**: Comprehensive testing (1-1.5 hours)
4. **Phase 8**: Documentation and cleanup (30 min)

**Total Estimated Time**: 3.5-4 hours

### Parallel Approach (Multiple Developers)

1. **Phase 1**: Team completes setup together (15 min)
2. **Phases 2-6**: Parallel implementation (30-45 min)
   - Dev A: Navbar
   - Dev B: Buttons
   - Dev C: Table
   - Dev D: Modals
3. **Phase 7**: Parallel testing (30-45 min)
4. **Phase 8**: Documentation (15 min)

**Total Estimated Time**: 1.5-2 hours

### MVP Validation Points

**After Phase 2 (Navbar)**: Validate centered layout works correctly before proceeding

**After Phase 3 (Buttons)**: Validate minimal hover animations feel professional

**After Phase 5 (Modals)**: Validate all animations simplified, UI feels cohesive

**After Phase 7 (Testing)**: Final validation that all success criteria met

---

## Success Criteria Checklist

### User-Facing Success Criteria

- [ ] Dashboard navbar has centered "Add Task" button between Logo (left) and Logout (right)
- [ ] No user identification (username/welcome text) visible in navbar
- [ ] Buttons respond to hover with color changes only (no scale/shadow effects)
- [ ] Table rows show subtle background tint on hover (no scale/shadow)
- [ ] Modals open/close with smooth fade animation only (no slide/scale)
- [ ] Overall UI feels clean, simple, professional, and uncluttered

### Technical Success Criteria

- [ ] No broken functionality (all CRUD operations work correctly)
- [ ] No accessibility regressions (WCAG compliance maintained)
- [ ] No performance regressions (60fps maintained, no jank)
- [ ] Code remains maintainable (no complexity increase, clear intent)
- [ ] All focus indicators visible and functional
- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces elements correctly

---

## Troubleshooting Guide

### Issue: Add Task button not perfectly centered

**Related Tasks**: T004-T007

**Solution**: Verify both outer `<div>` elements have `flex-1` class. Use browser DevTools to check computed widths match.

### Issue: Hover transition feels laggy

**Related Tasks**: T010-T017

**Solution**: Ensure `transition-colors` (not `transition-all`) is used. Check no other transitions applied by global styles.

### Issue: Modal still has slide/scale animation

**Related Tasks**: T022-T033

**Solution**: Check for multiple animation definitions. Search for `motion.` in modal files to find all Framer Motion usage.

### Issue: Focus indicators missing after changes

**Related Tasks**: T054-T058

**Solution**: Ensure focus classes (`focus:ring-*`, `focus:outline-*`) not accidentally removed. Verify in Button.tsx and modal components.

---

## Rollback Plan

If critical issues arise:

```bash
# Revert specific component
git checkout HEAD -- frontend/src/app/dashboard/page.tsx

# Or revert all UX polish changes
git checkout HEAD -- frontend/src/app/components/ui/Button.tsx
git checkout HEAD -- frontend/src/app/components/ui/Modal.tsx
git checkout HEAD -- frontend/src/app/components/TaskTable/TableRow.tsx
git checkout HEAD -- frontend/src/app/dashboard/page.tsx
```

---

## Notes

- [P] tasks can run in parallel (different files, no dependencies)
- Commit after each phase or logical group for granular version control
- Stop at any checkpoint to validate changes independently
- All file paths are relative to repository root
- Visual validation recommended after each implementation phase
- Comprehensive testing in Phase 7 ensures no regressions

---

**Total Tasks**: 76
**Parallelizable Tasks**: 34 (marked with [P])
**Estimated Effort**: 3.5-4 hours (sequential) / 1.5-2 hours (parallel)
**Complexity**: LOW (styling/animation changes only, no business logic)
