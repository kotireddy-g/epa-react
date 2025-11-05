import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ideaAnalysisApi, type VideoFeedItem, type VideoFeedResponse } from '../services/ideaAnalysisApi';

export type VideoContextKey =
  | 'idea'
  | 'validation'
  | 'business-plan'
  | 'planner'
  | 'implementation'
  | 'outcomes'
  | 'notifications'
  | 'profile'
  | 'general';

type VideoEngagementContextValue = {
  loading: boolean;
  error: string | null;
  videosBySection: Record<string, VideoFeedItem[]>;
  watchedIds: Set<string>;
  skippedIds: Set<string>;
  markWatched: (video: VideoFeedItem) => void;
  markSkipped: (video: VideoFeedItem) => void;
  refresh: () => Promise<void>;
  getNextVideoForContext: (context: VideoContextKey) => VideoFeedItem | null;
};

const STORAGE_KEY = 'video_engagement__status_v1';

type StoredStatus = {
  watched: string[];
  skipped: string[];
};

const defaultValue: VideoEngagementContextValue = {
  loading: true,
  error: null,
  videosBySection: {},
  watchedIds: new Set<string>(),
  skippedIds: new Set<string>(),
  markWatched: () => undefined,
  markSkipped: () => undefined,
  refresh: async () => undefined,
  getNextVideoForContext: () => null,
};

const VideoEngagementContext = createContext<VideoEngagementContextValue>(defaultValue);

const SECTION_ALIAS: Record<VideoContextKey, string[]> = {
  idea: ['idea', 'ideation', 'inspiration', 'brainstorm'],
  validation: ['validation', 'validate', 'market validation'],
  'business-plan': ['business plan', 'planning', 'strategy'],
  planner: ['planner', 'planning toolkit', 'execution plan'],
  implementation: ['implementation', 'execution', 'build'],
  outcomes: ['outcomes', 'metrics', 'success'],
  notifications: ['notifications', 'updates'],
  profile: ['profile', 'onboarding'],
  general: ['general', 'default'],
};

function normaliseKey(key: string): string {
  return key.trim().toLowerCase();
}

function loadStoredStatus(): StoredStatus {
  if (typeof window === 'undefined') return { watched: [], skipped: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { watched: [], skipped: [] };
    const parsed = JSON.parse(raw) as StoredStatus;
    return {
      watched: Array.isArray(parsed.watched) ? parsed.watched : [],
      skipped: Array.isArray(parsed.skipped) ? parsed.skipped : [],
    };
  } catch (error) {
    console.error('[VideoEngagement] Failed to parse stored status', error);
    return { watched: [], skipped: [] };
  }
}

function persistStatus(watched: Set<string>, skipped: Set<string>) {
  if (typeof window === 'undefined') return;
  const payload: StoredStatus = {
    watched: Array.from(watched),
    skipped: Array.from(skipped),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function VideoEngagementProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videosBySection, setVideosBySection] = useState<Record<string, VideoFeedItem[]>>({});
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: VideoFeedResponse = await ideaAnalysisApi.getVideoEngageFeed();
      
      // Check for API error response (ok: false)
      if (response.ok === false) {
        console.error('[VideoEngagement] API returned error:', response.error);
        console.error('[VideoEngagement] This is likely a YouTube API quota/key issue on the backend');
        console.info('[VideoEngagement] App will continue without video suggestions');
        
        // Set empty videos, don't show error to user (silent fail)
        setVideosBySection({});
        setLoading(false);
        return; // Stop here, don't retry
      }
      
      // Process successful response
      const sections: Record<string, VideoFeedItem[]> = {};

      if (response.sections) {
        Object.entries(response.sections).forEach(([key, items]) => {
          sections[normaliseKey(key)] = items ?? [];
        });
      }

      if (response.items && response.items.length > 0) {
        sections.general = response.items;
      }

      setVideosBySection(sections);
    } catch (err) {
      console.error('[VideoEngagement] Network error while fetching feed:', err);
      console.info('[VideoEngagement] App will continue without video suggestions');
      // Silent fail - set empty videos, don't show error to user
      setVideosBySection({});
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - function is stable

  useEffect(() => {
    const stored = loadStoredStatus();
    setWatchedIds(new Set(stored.watched));
    setSkippedIds(new Set(stored.skipped));
    fetchVideos().catch(error => {
      console.error('[VideoEngagement] Initial fetch failed', error);
    });
  }, [fetchVideos]);

  useEffect(() => {
    persistStatus(watchedIds, skippedIds);
  }, [watchedIds, skippedIds]);

  const markWatched = useCallback((video: VideoFeedItem) => {
    if (!video?.link) return;
    setWatchedIds(prev => {
      if (prev.has(video.link)) return prev;
      const next = new Set(prev);
      next.add(video.link);
      return next;
    });
    setSkippedIds(prev => {
      if (!prev.has(video.link)) return prev;
      const next = new Set(prev);
      next.delete(video.link);
      return next;
    });
  }, []); // No dependencies - uses functional setState

  const markSkipped = useCallback((video: VideoFeedItem) => {
    if (!video?.link) return;
    setSkippedIds(prev => {
      if (prev.has(video.link)) return prev;
      const next = new Set(prev);
      next.add(video.link);
      return next;
    });
  }, []); // No dependencies - uses functional setState

  const getNextVideoForContext = useCallback((context: VideoContextKey): VideoFeedItem | null => {
    const aliases = SECTION_ALIAS[context] ?? [];
    const loweredKeys = Object.keys(videosBySection);

    const candidates: VideoFeedItem[] = [];
    aliases.forEach(alias => {
      const normalisedAlias = normaliseKey(alias);
      if (loweredKeys.includes(normalisedAlias)) {
        candidates.push(...(videosBySection[normalisedAlias] ?? []));
      }
    });

    if (candidates.length === 0 && videosBySection.general) {
      candidates.push(...videosBySection.general);
    }

    if (candidates.length === 0) return null;

    return candidates.find(video => {
      const id = video.link;
      if (!id) return false;
      return !watchedIds.has(id) && !skippedIds.has(id);
    }) ?? null;
  }, [videosBySection, watchedIds, skippedIds]); // Depends on these values

  const contextValue = useMemo<VideoEngagementContextValue>(() => ({
    loading,
    error,
    videosBySection,
    watchedIds,
    skippedIds,
    markWatched,
    markSkipped,
    refresh: fetchVideos,
    getNextVideoForContext,
  }), [loading, error, videosBySection, watchedIds, skippedIds]);

  return (
    <VideoEngagementContext.Provider value={contextValue}>
      {children}
    </VideoEngagementContext.Provider>
  );
}

export function useVideoEngagement() {
  const context = useContext(VideoEngagementContext);
  if (!context) {
    throw new Error('useVideoEngagement must be used within VideoEngagementProvider');
  }
  return context;
}
