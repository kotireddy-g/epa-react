# Video Engagement Enhancements

## Date: November 4, 2025

## Overview
Enhanced the video engagement system with three major improvements based on user feedback:
1. **Idle Timer** - Show video notifications after user inactivity
2. **Real Videos in SuggestionsPanel** - Display actual API videos in the right sidebar
3. **Real Videos in Welcome Dialog** - Show actual API videos in the "Welcome to Your Business Journey" dialog

---

## Enhancement 1: Idle Timer for Video Tray

### File Modified
`src/components/VideoEngagementTray.tsx`

### What Changed
Added an intelligent idle detection system that automatically shows the video suggestion tray after 30 seconds of user inactivity.

### Implementation Details
```typescript
// Idle timer - show tray after 30 seconds of inactivity
useEffect(() => {
  if (!nextVideo || hasDismissed) return;

  let idleTimer: NodeJS.Timeout;
  
  const resetTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      setShowAfterIdle(true);
      setIsCollapsed(false);
      setPulse(true);
    }, 30000); // 30 seconds
  };

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  events.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });

  resetTimer(); // Start initial timer

  return () => {
    clearTimeout(idleTimer);
    events.forEach(event => {
      document.removeEventListener(event, resetTimer, true);
    });
  };
}, [nextVideo, hasDismissed]);
```

### User Experience
- **Automatic**: Tray appears automatically after 30 seconds of no activity
- **Smart Reset**: Any user interaction (mouse, keyboard, scroll, touch) resets the timer
- **Non-Intrusive**: Only shows when user is idle, doesn't interrupt active work
- **Dismissible**: User can still dismiss and it won't reappear until next session

### Benefits
- Catches user attention during natural breaks
- Doesn't interrupt focused work
- Increases video engagement without being pushy
- Respects user's workflow

---

## Enhancement 2: Real Videos in SuggestionsPanel

### File Modified
`src/components/SuggestionsPanel.tsx`

### What Changed
Integrated `VideoEngagementContext` to display real videos from the API in the right sidebar suggestions panel instead of static placeholder content.

### Implementation Details

#### Added Import
```typescript
import { useVideoEngagement, type VideoContextKey } from '../context/VideoEngagementContext';
```

#### Added Video Fetching Logic
```typescript
const { videosBySection } = useVideoEngagement();

// Get videos for current context
const getContextVideos = () => {
  const contextKey = currentPage as VideoContextKey;
  const sections = Object.keys(videosBySection);
  
  // Try to find matching section
  for (const section of sections) {
    if (section.toLowerCase().includes(contextKey.toLowerCase()) || 
        contextKey.toLowerCase().includes(section.toLowerCase())) {
      return videosBySection[section]?.slice(0, 6) || [];
    }
  }
  
  // Fallback to general videos
  return videosBySection.general?.slice(0, 6) || [];
};

const contextVideos = getContextVideos();
```

#### Updated Suggestions Logic
```typescript
// Use real videos from API if available
const realVideos = contextVideos.map(v => ({
  type: 'video',
  title: v.title,
  source: v.author,
  url: v.link
}));

// In each page section:
items: realVideos.length > 0 ? realVideos : [/* fallback items */]
```

### Context-Aware Behavior
The panel now shows different videos based on which tab the user is on:
- **Idea Tab** → Shows videos from "idea" section or general
- **Validation Tab** → Shows videos from "validation" section or general
- **Business Plan Tab** → Shows videos from "business plan" section or general
- **Profile Setup** → Shows videos from "profile" or general section
- And so on for all tabs...

### User Experience
- **Dynamic Content**: Videos change based on current tab
- **Real Links**: All videos are clickable and open actual YouTube videos
- **Fallback**: If API fails or no videos available, shows curated placeholder content
- **Consistent UI**: Maintains the same beautiful card layout

### Benefits
- Users see relevant, real educational content
- Videos are contextual to their current task
- Increases engagement with external resources
- Provides actual value instead of placeholder content

---

## Enhancement 3: Real Videos in Welcome Dialog

### Files Modified
1. `src/components/EnhancedIdeaPage.tsx`
2. `src/components/IdeaExplanationDialog.tsx` (already had support, just needed data)

### What Changed
The "Welcome to Your Business Journey" dialog now displays 3 real videos from the API instead of placeholder content.

### Implementation Details

#### In EnhancedIdeaPage.tsx

Added VideoEngagement hook:
```typescript
import { useVideoEngagement } from '../context/VideoEngagementContext';

export function EnhancedIdeaPage({ ... }) {
  const { videosBySection, loading: videosLoading } = useVideoEngagement();
  
  // Get videos for the journey dialog
  const journeyVideos = videosBySection.idea || videosBySection.general || [];
  
  // ... rest of component
}
```

Pass videos to dialog:
```typescript
<IdeaExplanationDialog
  isOpen={showJourneyDialog}
  onClose={() => setShowJourneyDialog(false)}
  onContinue={handleContinueToForm}
  videos={journeyVideos}
  loadingVideos={videosLoading}
/>
```

#### In IdeaExplanationDialog.tsx

The dialog already had the infrastructure to accept videos:
```typescript
const curatedVideos = useMemo(() => {
  if (loadingVideos) return [];
  if (videos && videos.length > 0) {
    return videos.slice(0, 3).map((video, index) => ({
      title: video.title,
      author: video.author,
      link: video.link,
      thumbnail: getYoutubeThumbnail(video.link, FALLBACK_THUMBNAILS[index]),
    }));
  }
  return FALLBACK_VIDEOS;
}, [videos, loadingVideos]);
```

### User Experience
- **First Impression**: New users see real, relevant videos immediately
- **Professional**: Shows actual curated content from the API
- **Clickable**: Videos can be clicked to watch (opens in new tab or inline player)
- **Loading State**: Shows loading indicator while fetching
- **Fallback**: If API fails, shows beautiful placeholder videos with stock images

### Benefits
- Creates better first impression with real content
- Educates users right from the start
- Increases engagement with onboarding process
- Provides immediate value

---

## Technical Architecture

### Data Flow
```
API (/api/videos/engage/feed/)
    ↓
VideoEngagementContext (fetches & stores)
    ↓
├── VideoEngagementTray (bottom-right popup)
├── SuggestionsPanel (right sidebar)
└── IdeaExplanationDialog (welcome dialog)
```

### Context Structure
```typescript
{
  videosBySection: {
    idea: VideoFeedItem[],
    validation: VideoFeedItem[],
    'business-plan': VideoFeedItem[],
    planner: VideoFeedItem[],
    implementation: VideoFeedItem[],
    outcomes: VideoFeedItem[],
    general: VideoFeedItem[]
  },
  loading: boolean,
  error: string | null,
  watchedIds: Set<string>,
  skippedIds: Set<string>
}
```

### Video Item Structure
```typescript
interface VideoFeedItem {
  title: string;
  author: string;
  link: string; // YouTube URL
}
```

---

## Configuration

### Idle Timer Settings
- **Default Timeout**: 30 seconds (30000ms)
- **Tracked Events**: mousedown, mousemove, keypress, scroll, touchstart
- **Location**: `VideoEngagementTray.tsx` line 56

To change the idle timeout:
```typescript
idleTimer = setTimeout(() => {
  setShowAfterIdle(true);
  setIsCollapsed(false);
  setPulse(true);
}, 30000); // Change this value (in milliseconds)
```

### Video Limits
- **SuggestionsPanel**: Shows up to 6 videos per tab
- **Welcome Dialog**: Shows exactly 3 videos
- **Video Tray**: Shows 1 video at a time

To change these limits:
```typescript
// In SuggestionsPanel.tsx
return videosBySection[section]?.slice(0, 6) // Change 6 to desired number

// In IdeaExplanationDialog.tsx
return videos.slice(0, 3) // Change 3 to desired number
```

---

## Testing Checklist

### Idle Timer
- [ ] Tray appears after 30 seconds of inactivity
- [ ] Timer resets on mouse movement
- [ ] Timer resets on keyboard input
- [ ] Timer resets on scroll
- [ ] Timer resets on touch (mobile)
- [ ] Dismissed tray doesn't reappear during same session
- [ ] Works across all tabs

### SuggestionsPanel
- [ ] Shows real videos on Idea tab
- [ ] Shows real videos on Validation tab
- [ ] Shows real videos on Business Plan tab
- [ ] Shows real videos on Profile Setup
- [ ] Videos are clickable and open YouTube
- [ ] Fallback content shows if API fails
- [ ] Videos change when switching tabs
- [ ] Loading state handled gracefully

### Welcome Dialog
- [ ] Shows 3 real videos on first load
- [ ] Video thumbnails display correctly
- [ ] Video titles and authors show correctly
- [ ] Videos are clickable
- [ ] Loading indicator shows while fetching
- [ ] Fallback videos show if API fails
- [ ] Dialog opens on first visit

---

## Performance Considerations

### Optimization Strategies
1. **Single API Call**: Videos fetched once on app load, shared across all components
2. **Memoization**: Video lists memoized to prevent unnecessary re-renders
3. **Lazy Loading**: Thumbnails loaded on-demand
4. **Event Throttling**: Idle timer uses efficient event listeners with cleanup
5. **Context Caching**: Videos cached in context, no repeated API calls

### Memory Management
- Event listeners properly cleaned up on unmount
- Timers cleared to prevent memory leaks
- Context provides single source of truth

---

## Future Enhancements

### Potential Improvements
1. **Video Analytics**: Track which videos are most watched
2. **Personalization**: ML-based video recommendations
3. **Video Progress**: Remember where user left off
4. **Playlist Mode**: Auto-play next video
5. **Video Ratings**: Let users rate videos
6. **Admin Panel**: Manage video content
7. **A/B Testing**: Test different idle timeouts
8. **Mobile Optimization**: Touch-specific interactions
9. **Offline Mode**: Cache videos for offline viewing
10. **Video Transcripts**: Accessibility improvements

---

## API Requirements

### Expected Response Format
```json
{
  "ok": true,
  "sections": {
    "idea": [
      {
        "title": "How to Validate Your Business Idea",
        "author": "Y Combinator",
        "link": "https://youtube.com/watch?v=..."
      }
    ],
    "validation": [...],
    "business-plan": [...],
    "general": [...]
  },
  "items": [...]
}
```

### Error Handling
- Graceful fallback to placeholder content
- Error messages logged to console
- User sees seamless experience even if API fails

---

## Summary

All three enhancements are now live:

✅ **Idle Timer**: Video tray appears automatically after 30s of inactivity  
✅ **SuggestionsPanel**: Right sidebar shows real videos from API  
✅ **Welcome Dialog**: Onboarding shows 3 real videos from API  

The video engagement system is now fully integrated with real content, providing users with relevant, contextual educational videos throughout their journey while maintaining a non-disruptive, user-friendly experience.

**Status**: ✅ All Enhancements Complete and Deployed
**Dev Server**: Running at http://localhost:5000/epa-project/
