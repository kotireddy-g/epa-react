# QA Fixes Implementation Plan

## Status Summary:
- ✅ Issue 1: LinkedIn Optional - ALREADY DONE (not in required fields)
- ✅ Issue 2: Keyword Highlighting - FIXED (shows only #keyword, not full text)
- 🔄 Issue 3: Capitalize Headers - IN PROGRESS
- ⏳ Issue 4: Charts & All API Data - PENDING (COMPLEX)
- ⏳ Issue 5: Sync Key Points - PENDING
- ⏳ Issue 6: Autofill Industry - PENDING
- ⏳ Issue 7: Validation Logic - PENDING
- ⏳ Issue 8: 401 Token Refresh - PENDING (COMPLEX)

---

## Issue 3: Capitalize All Headers in Idea Section

### Files to Modify:
- `src/components/EnhancedIdeaPage.tsx` (if it displays API data)
- OR check which component displays the Idea section after API response

### Changes Needed:
Find all section headers and ensure they use proper capitalization:
- "key_points_summary" → "Key Points Summary"
- "market_attributes" → "Market Attributes"
- "stats_summary" → "Stats Summary"
- "population_access_table" → "Population Access Table"
- etc.

---

## Issue 4: Display ALL API Data + Add Charts

### API Response Structure:
```json
{
  "final_output": {
    "key_points_summary": {...},
    "market_attributes": {...},
    "stats_summary": {
      "TAM": "₹1,00,000 Crores",
      "SAM": "₹20,000 Crores",
      "SOM": "₹2,000 Crores",
      "CAGR": "14.2%",
      "adoption_rate": "30%",
      "price_bands": {...}
    },
    "population_access_table": [...],
    "budget_fit_tiers_table": [...],
    "technology_development_strategy_table": [...],
    "gtm_customer_strategy_table": [...],
    "competitor_gap_table": [...],
    "market_product_fit_table": [...],
    "references": {...},
    "verdict": {...}
  }
}
```

### Charts to Add:
1. **Pie Chart**: Market Size Distribution (TAM, SAM, SOM)
2. **Bar Graph**: Competitor Gap Analysis OR Budget Fit Tiers

### Libraries Needed:
- `recharts` (already installed?) or `chart.js` or `victory`

### Implementation:
1. Install recharts: `npm install recharts`
2. Create chart components
3. Display ALL sections from API response
4. Add charts in appropriate sections

---

## Issue 5: Sync Key Points Summary

### Problem:
- Idea section shows one version of key_points_summary
- Confirmation dialog shows different version

### Solution:
- Both should use `apiResponse.final_output.key_points_summary`
- Find IdeaConfirmationDialog component
- Ensure it receives and displays the same data

---

## Issue 6: Autofill Industry/Category

### Files:
- `src/components/CompanyNameDialog.tsx` (or similar)
- Should read from `apiResponse.final_output.market_attributes.category` and `domain`

### Implementation:
- Pass apiResponse to dialog
- Pre-fill industry dropdown with category value
- Pre-fill domain with domain value

---

## Issue 7: Validation Submit Button Logic

### Current Logic:
- Unknown (need to check ValidationPage)

### New Logic:
- Enable "Submit Validation" button if:
  - (Idea >= 70% OR Persona >= 70%) AND
  - (Network >= 70% OR Finance >= 70%)
- Show button only in sections where criteria is met

### Files:
- `src/components/NewValidationPage.tsx` or `ValidationPage.tsx`

---

## Issue 8: 401 Token Refresh Interceptor

### API Endpoint:
```
POST http://192.168.1.111:8089/accounts/api/token/refresh/
Body: { "refresh": "<refresh_token>" }
Response: { "access": "<new_access_token>" }
```

### Implementation:
1. Create axios interceptor in `src/services/ideaAnalysisApi.ts`
2. On 401 error:
   - Get refresh token from localStorage
   - Call refresh API
   - Update access token in localStorage
   - Retry original request
3. If refresh fails (401), redirect to login

### Pseudocode:
```typescript
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('/accounts/api/token/refresh/', {
            refresh: refreshToken
          });
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);
          // Retry original request
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          // Refresh failed, logout
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Priority Order:
1. ✅ Issue 1 & 2 - DONE
2. Issue 8 - Token Refresh (CRITICAL for stability)
3. Issue 3 - Capitalize Headers (EASY)
4. Issue 5 - Sync Key Points (MEDIUM)
5. Issue 6 - Autofill Industry (EASY)
6. Issue 7 - Validation Logic (MEDIUM)
7. Issue 4 - Charts & All Data (COMPLEX, TIME-CONSUMING)

---

## Next Steps:
1. Implement Issue 8 (Token Refresh) first for stability
2. Then Issue 3 (Capitalize)
3. Then Issues 5, 6, 7
4. Finally Issue 4 (Charts) - most time-consuming
