# Production-Ready Fixes - Implementation Plan

## ✅ Completed:
1. ✅ Enhanced budget keyword detection (80L, 80 Lakhs, 20C, 20 Crores)
2. ✅ Removed "Add Task" button from Business Plan
3. ✅ Show only API templates (removed hardcoded templates when API data exists)
4. ✅ Removed "All Templates" section
5. ✅ Created SuggestionsSidebar component

## 🔄 In Progress:

### Issue 3: Add Suggestions Sidebar to All Tabs
**Files to modify:**
- BusinessPlanPage.tsx - Add sidebar with learning_recommendations, references
- PlannerPage.tsx - Add sidebar
- ImplementationPage.tsx - Add sidebar  
- OutcomesPage.tsx - Add sidebar

**Data source:** `planData.final_output.learning_recommendations` and `planData.final_output.references`

### Issue 4: Journey View Not Updating
**Problem:** Implementation tab journey_view from API not rendering
**File:** ImplementationPage.tsx
**Fix:** Add journey view rendering from `implementationData.categories[].views.journey_view`

### Issue 5: Outcomes Crash on Missing Data
**Problem:** Blank screen when clicking outcome card with missing data
**File:** OutcomesPage.tsx, OutcomeDetailDialog.tsx
**Fix:** Add null checks, show "No data available" messages

## Implementation Strategy:
1. Add Suggestions sidebar to BusinessPlanPage (with flex layout)
2. Add Suggestions sidebar to other 3 tabs
3. Fix Journey view in Implementation tab
4. Fix Outcomes crash with graceful error handling
5. Test all scenarios

## Key Points:
- Extract references from `planData.final_output.references`
- Extract learning_recommendations from `planData.final_output.learning_recommendations`
- Filter out placeholder items
- Show meaningful "No data" messages
- Ensure no crashes on missing data
