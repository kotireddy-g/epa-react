# Navigation & State Management Plan

## Date: November 5, 2025, 5:35 PM

---

## ✅ Point 1: IMPLEMENTED - Organize Ideas into Sections

**Status:** ✅ Complete

### Implementation:
- **Drafts Section** (Top): Shows local ideas from `ideas` array that haven't been analyzed yet
  - Displayed with dashed border
  - Badge: "Draft" (gray)
  - Button: "Continue Editing"
  
- **Your Active Ideas Section** (Bottom): Shows ideas from API (`userIdeas` array)
  - Displayed with solid border
  - Badges: "Analysis" (blue), "Validated" (green), "Plan" (purple)
  - Button: "View Details"

---

## 📋 Point 2: Current Idea Navigation (Create New → Business Plan)

### Scenario:
User clicks "Create New Idea" → Analyzes → Validates → Creates Business Plan

### Current State Management:

**Problem:** When user navigates through tabs (Idea → Validation → Business Plan), we need to maintain the current idea's state and allow seamless back-and-forth navigation.

### Proposed Solution: **"Active Session" State Management**

#### Concept:
- Introduce an "active session" concept in `App.tsx`
- When user starts analyzing an idea, it becomes the "active session"
- This session persists across tab navigation until user clicks "Home" or "Create New Idea"

#### Implementation:

```typescript
// App.tsx - New state
const [activeSession, setActiveSession] = useState<{
  ideaId: string;
  currentStage: 'analysis' | 'validation' | 'plan';
  analysisData: AnalyseResponse | null;
  validationData: ValidationResponse | null;
  planData: PlanResponse | null;
  ideaSummary: string;
  ideaDescription: string;
} | null>(null);
```

#### Flow:

**1. User Starts Analysis (Idea Tab)**
```
User enters idea → Clicks "Submit for Analysis"
  ↓
Analysis API called → Response received
  ↓
setActiveSession({
  ideaId: response.idea_id,
  currentStage: 'analysis',
  analysisData: response,
  validationData: null,
  planData: null,
  ideaSummary: userInput,
  ideaDescription: userDescription
})
  ↓
Auto-navigate to Validation tab
```

**2. User Completes Validation**
```
User fills validation form → Submits
  ↓
Validation API called → Response received
  ↓
Update activeSession:
  currentStage: 'validation'
  validationData: response
  ↓
Auto-navigate to Business Plan tab
```

**3. User Completes Plan**
```
User answers followup questions → Submits
  ↓
Plan API called → Response received
  ↓
Update activeSession:
  currentStage: 'plan'
  planData: response
  ↓
Stay on Business Plan tab (show success message)
```

#### Navigation Behavior:

**Forward Navigation (Natural Flow):**
- Idea → Validation → Business Plan → Planner → Implementation → Outcomes
- Each stage auto-navigates to next after completion

**Backward Navigation (User Clicks Tab):**
- If user clicks "Idea" tab while in active session:
  - Show "Active Session" banner at top
  - Display read-only view of analyzed idea
  - Button: "View in Validation" or "Continue to Next Step"
  - Button: "Start New Idea" (clears active session)

- If user clicks "Validation" tab:
  - If validation completed: Show read-only validation results
  - If validation not completed: Show validation form with pre-filled data
  - Button: "Continue to Business Plan"

- If user clicks "Business Plan" tab:
  - If plan completed: Show business plan details
  - If plan not completed: Show followup questions dialog
  - Button: "Continue to Planner"

#### Visual Indicators:

**Active Session Banner:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Active Session: "Cloud Kitchen in Hyderabad"            │
│ Current Stage: Validation ✓ | Next: Business Plan          │
│ [Continue] [Start New Idea]                                │
└─────────────────────────────────────────────────────────────┘
```

**Sidebar Indicators:**
- Current stage: Highlighted in blue
- Completed stages: Green checkmark ✓
- Upcoming stages: Gray

---

## 📋 Point 3: Draft Click Navigation

### Scenario:
User clicks "Home" or "Idea" tab → Sees draft cards → Clicks "Continue Editing"

### Current State:
- Drafts are local ideas stored in `ideas` array
- They have `summary` and `description` but no `ideaId` from API

### Proposed Solution: **"Resume Draft" Flow**

#### Implementation:

```typescript
// EnhancedIdeaPage.tsx
const handleDraftClick = (draft: Idea) => {
  console.log('[EnhancedIdeaPage] Resuming draft:', draft);
  
  // Pre-fill the form with draft data
  setSummary(draft.summary);
  setDescription(draft.description || '');
  setSummarySubmitted(false);
  
  // Show the create form
  setShowCreateForm(true);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

#### Flow:

**1. User Clicks "Continue Editing" on Draft**
```
Draft card clicked
  ↓
Pre-fill form with draft.summary and draft.description
  ↓
Show create form (same as "Create New Idea")
  ↓
User can edit and submit for analysis
```

**2. After Editing**
```
User modifies idea → Clicks "Submit for Analysis"
  ↓
Analysis API called
  ↓
Draft is removed from local `ideas` array
  ↓
New active session created
  ↓
Idea appears in "Your Active Ideas" section
```

#### Benefits:
- ✅ Simple: Reuses existing create form
- ✅ Familiar: Same UX as creating new idea
- ✅ Clean: No complex state management
- ✅ Flexible: User can edit before submitting

---

## 📋 Point 4: Active Idea Click Navigation

### Scenario:
User clicks "View Details" on an idea card in "Your Active Ideas" section

### Current State:
- Ideas from API have `analysis_data`, `validation_data`, `plan_data`
- Status badges: "Analysis", "Validated", "Plan"

### Proposed Solution: **"Smart Resume" Based on Status**

#### Implementation:

```typescript
// EnhancedIdeaPage.tsx - Already partially implemented
const handleViewDetails = (idea: UserIdeaItem) => {
  const hasAnalysis = !!idea.analysis_data;
  const hasValidation = !!idea.validation_data;
  const hasPlan = !!idea.plan_data;
  
  // Set as active session
  setActiveSession({
    ideaId: idea.idea_id,
    currentStage: hasPlan ? 'plan' : hasValidation ? 'validation' : 'analysis',
    analysisData: idea.analysis_data,
    validationData: idea.validation_data,
    planData: idea.plan_data,
    ideaSummary: idea.analysis_data?.validation_data?.idea_description || '',
    ideaDescription: ''
  });
  
  // Navigate based on status
  if (hasPlan) {
    // Navigate to Business Plan tab
    onNavigateToPlan(idea.idea_id, idea.plan_data);
  } else if (hasValidation) {
    // Navigate to Validation tab (show AI followup questions)
    onNavigateToValidation(idea.idea_id, idea.validation_data);
  } else if (hasAnalysis) {
    // Navigate to Validation tab (show validation form)
    onNavigateToValidation(idea.idea_id, idea.analysis_data);
  }
};
```

#### Navigation Logic:

**Status: "Analysis" (Blue Badge)**
```
Idea has: analysis_data only
  ↓
Navigate to: Validation tab
  ↓
Show: Validation form with pre-filled data from analysis
  ↓
User Action: Fill validation answers → Submit
  ↓
Result: Validation completed → Navigate to Business Plan
```

**Status: "Validated" (Green Badge)**
```
Idea has: analysis_data + validation_data
  ↓
Navigate to: Validation tab OR Business Plan tab
  ↓
Option A: Show validation results (read-only)
  Button: "Continue to Business Plan"
  ↓
Option B: Directly navigate to Business Plan tab
  Show: AI followup questions dialog
  ↓
User Action: Answer questions → Submit
  ↓
Result: Plan created → Stay on Business Plan tab
```

**Status: "Plan" (Purple Badge)**
```
Idea has: analysis_data + validation_data + plan_data
  ↓
Navigate to: Business Plan tab
  ↓
Show: Complete business plan details
  ↓
User can: View all tabs (Planner, Implementation, Outcomes)
  All data is available for display
```

#### Recommended Navigation:

**My Recommendation:** Use **Option B** for "Validated" status

**Reason:**
- Faster UX: Skip intermediate validation view
- Natural flow: User expects to continue to next step
- Consistent: Same behavior as completing validation in active session

**Implementation:**
```typescript
if (hasPlan) {
  // Show complete business plan
  navigateTo('business-plan');
} else if (hasValidation) {
  // Skip validation view, go directly to business plan
  // Show AI followup questions dialog
  navigateTo('business-plan');
  showAIFollowupDialog(idea.validation_data.ai_followup_questions);
} else if (hasAnalysis) {
  // Show validation form
  navigateTo('validation');
}
```

---

## 🎯 Complete User Journeys

### Journey 1: New Idea → Complete Flow

```
1. Home/Idea Tab
   ├─ Click "Create New Idea"
   └─ Enter idea → Submit for Analysis
      ↓
2. Auto-navigate to Validation Tab
   ├─ Fill validation form
   └─ Submit
      ↓
3. Auto-navigate to Business Plan Tab
   ├─ Answer AI followup questions
   └─ Submit
      ↓
4. Stay on Business Plan Tab
   ├─ View complete business plan
   └─ Can navigate to Planner, Implementation, Outcomes
```

### Journey 2: Resume Draft

```
1. Home/Idea Tab
   ├─ See "Drafts" section
   └─ Click "Continue Editing" on draft
      ↓
2. Form pre-filled with draft data
   ├─ Edit if needed
   └─ Submit for Analysis
      ↓
3. Same as Journey 1 (step 2 onwards)
```

### Journey 3: Resume Active Idea (Analysis Stage)

```
1. Home/Idea Tab
   ├─ See "Your Active Ideas" section
   └─ Click "View Details" on idea with "Analysis" badge
      ↓
2. Navigate to Validation Tab
   ├─ Validation form pre-filled with analysis data
   └─ Fill remaining fields → Submit
      ↓
3. Same as Journey 1 (step 3 onwards)
```

### Journey 4: Resume Active Idea (Validated Stage)

```
1. Home/Idea Tab
   ├─ See "Your Active Ideas" section
   └─ Click "View Details" on idea with "Validated" badge
      ↓
2. Navigate to Business Plan Tab
   ├─ AI followup questions dialog appears
   └─ Answer questions → Submit
      ↓
3. View complete business plan
   └─ Can navigate to Planner, Implementation, Outcomes
```

### Journey 5: View Completed Idea (Plan Stage)

```
1. Home/Idea Tab
   ├─ See "Your Active Ideas" section
   └─ Click "View Details" on idea with "Plan" badge
      ↓
2. Navigate to Business Plan Tab
   ├─ View complete business plan
   └─ All tabs accessible (Planner, Implementation, Outcomes)
```

### Journey 6: Back Navigation During Active Session

```
1. User is on Validation Tab (active session)
   └─ Clicks "Idea" tab in sidebar
      ↓
2. Idea Tab shows:
   ├─ Active Session Banner at top
   ├─ "Drafts" section (if any)
   └─ "Your Active Ideas" section
      ↓
3. User can:
   ├─ Click "Continue" in banner → Back to Validation
   ├─ Click "Start New Idea" → Clear session, show form
   └─ Click other idea cards → Switch active session
```

---

## 🔧 Implementation Checklist

### Phase 1: Active Session Management (Point 2)
- [ ] Add `activeSession` state to `App.tsx`
- [ ] Create `setActiveSession` function
- [ ] Update `handleIdeaSubmit` to set active session
- [ ] Update navigation functions to check active session
- [ ] Add "Active Session Banner" component
- [ ] Update sidebar to show progress indicators
- [ ] Test forward navigation (Idea → Validation → Plan)
- [ ] Test backward navigation (clicking tabs during session)

### Phase 2: Draft Resume (Point 3)
- [ ] Implement `handleDraftClick` in `EnhancedIdeaPage.tsx`
- [ ] Pre-fill form with draft data
- [ ] Show create form on draft click
- [ ] Remove draft from local array after analysis
- [ ] Test draft editing and submission
- [ ] Test draft deletion (if needed)

### Phase 3: Active Idea Resume (Point 4)
- [ ] Update `handleViewDetails` to set active session
- [ ] Implement smart navigation based on status
- [ ] Test "Analysis" status navigation
- [ ] Test "Validated" status navigation
- [ ] Test "Plan" status navigation
- [ ] Test switching between different ideas

### Phase 4: Polish & Edge Cases
- [ ] Handle "Home" button click (clear active session)
- [ ] Handle "Create New Idea" during active session (confirm dialog)
- [ ] Handle browser refresh (restore active session from localStorage)
- [ ] Handle API errors during navigation
- [ ] Add loading states for navigation
- [ ] Add success/error toasts

---

## 🎨 UI Components Needed

### 1. Active Session Banner
```tsx
<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-blue-900 font-semibold">
        🔄 Active Session: "{activeSession.ideaSummary}"
      </h3>
      <p className="text-blue-700 text-sm mt-1">
        Current Stage: {activeSession.currentStage} | Next: {getNextStage()}
      </p>
    </div>
    <div className="flex gap-2">
      <Button onClick={handleContinueSession}>Continue</Button>
      <Button variant="outline" onClick={handleStartNewIdea}>Start New Idea</Button>
    </div>
  </div>
</div>
```

### 2. Progress Indicator in Sidebar
```tsx
<div className="sidebar-item">
  {activeSession && (
    <div className="progress-dots">
      <span className={stage >= 'analysis' ? 'completed' : 'pending'}>●</span>
      <span className={stage >= 'validation' ? 'completed' : 'pending'}>●</span>
      <span className={stage >= 'plan' ? 'completed' : 'pending'}>●</span>
    </div>
  )}
</div>
```

### 3. Confirmation Dialog for New Idea
```tsx
<Dialog open={showNewIdeaConfirm}>
  <DialogContent>
    <DialogTitle>Start New Idea?</DialogTitle>
    <DialogDescription>
      You have an active session. Starting a new idea will save your current progress.
    </DialogDescription>
    <DialogFooter>
      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleConfirmNewIdea}>Start New Idea</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 💾 Data Persistence

### LocalStorage Structure:

```json
{
  "executionPlannerSession": {
    "isAuthenticated": true,
    "user": { ... },
    "tokens": { ... },
    "userProfile": { ... },
    "isProfileComplete": true,
    "activeSession": {
      "ideaId": "uuid-123",
      "currentStage": "validation",
      "analysisData": { ... },
      "validationData": null,
      "planData": null,
      "ideaSummary": "Cloud Kitchen in Hyderabad",
      "ideaDescription": "...",
      "timestamp": "2025-11-05T17:35:00Z"
    }
  },
  "ideas": [
    {
      "id": "local-1",
      "summary": "Draft idea 1",
      "description": "...",
      "status": "draft",
      "createdAt": "2025-11-05T17:00:00Z",
      "isActive": true
    }
  ]
}
```

### Restore on Refresh:

```typescript
useEffect(() => {
  const sessionData = localStorage.getItem('executionPlannerSession');
  if (sessionData) {
    const session = JSON.parse(sessionData);
    if (session.activeSession) {
      // Restore active session
      setActiveSession(session.activeSession);
      // Navigate to appropriate tab
      navigateToStage(session.activeSession.currentStage);
    }
  }
}, []);
```

---

## 🧪 Testing Scenarios

### Test 1: Complete Flow
1. Create new idea
2. Analyze
3. Validate
4. Create plan
5. Verify all data persisted
6. Verify navigation works

### Test 2: Draft Resume
1. Create draft (don't analyze)
2. Click "Home"
3. Click "Continue Editing" on draft
4. Verify form pre-filled
5. Submit for analysis
6. Verify draft removed

### Test 3: Active Idea Resume (Analysis)
1. Analyze idea (don't validate)
2. Click "Home"
3. Click "View Details" on idea
4. Verify navigates to Validation
5. Complete validation
6. Verify updates correctly

### Test 4: Active Idea Resume (Validated)
1. Analyze and validate idea (don't create plan)
2. Click "Home"
3. Click "View Details" on idea
4. Verify navigates to Business Plan
5. Complete plan
6. Verify updates correctly

### Test 5: Active Idea Resume (Plan)
1. Complete entire flow
2. Click "Home"
3. Click "View Details" on idea
4. Verify navigates to Business Plan
5. Verify all data visible

### Test 6: Back Navigation
1. Start analyzing idea
2. Click "Validation" tab
3. Click "Idea" tab
4. Verify active session banner shows
5. Click "Continue"
6. Verify returns to Validation

### Test 7: Browser Refresh
1. Start analyzing idea
2. Refresh browser
3. Verify active session restored
4. Verify navigates to correct tab

---

## 📊 Summary

### Key Decisions:

1. **Active Session State:** Centralized in `App.tsx`, persisted in localStorage
2. **Draft Resume:** Pre-fill form, reuse create flow
3. **Active Idea Resume:** Smart navigation based on status
4. **Backward Navigation:** Show active session banner, allow continue or start new
5. **Data Persistence:** Save active session to localStorage, restore on refresh

### Benefits:

- ✅ **Seamless UX:** Users can navigate freely without losing progress
- ✅ **Clear State:** Always know what stage user is in
- ✅ **Flexible:** Can switch between ideas or start new ones
- ✅ **Persistent:** Survives browser refresh
- ✅ **Intuitive:** Natural flow with visual indicators

### Next Steps:

1. **Review this plan** and confirm approach
2. **Implement Phase 1** (Active Session Management)
3. **Test thoroughly** before moving to Phase 2
4. **Iterate** based on user feedback

---

**Status:** 📝 Plan Ready for Review  
**Estimated Implementation Time:** 4-6 hours  
**Complexity:** Medium  
**Risk:** Low (incremental changes, can rollback easily)

---

## 🤔 Questions for Confirmation

1. **Active Session Banner:** Should it be dismissible or always visible during active session?
2. **Draft Deletion:** Should users be able to delete drafts manually?
3. **Multiple Active Sessions:** Should we allow only one active session or multiple?
4. **Auto-save:** Should we auto-save draft progress as user types?
5. **Session Timeout:** Should active sessions expire after X hours/days?

Please review and confirm your preferences! 🚀
