import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Play, SkipForward, CheckCircle2, Lightbulb, Loader2 } from 'lucide-react';
import { useVideoEngagement, type VideoContextKey } from '../context/VideoEngagementContext';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface VideoEngagementTrayProps {
  contextKey: VideoContextKey;
  className?: string;
}

const YT_ID_REGEX = /(?:[?&]v=|youtu\.be\/)([\w-]{11})/i;

function extractYoutubeId(url?: string | null): string {
  if (!url) return '';
  const match = url.match(YT_ID_REGEX);
  if (match && match[1]) return match[1];
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '');
    }
    return parsed.searchParams.get('v') || '';
  } catch {
    return '';
  }
}

export function VideoEngagementTray({ contextKey, className }: VideoEngagementTrayProps) {
  const { loading, getNextVideoForContext, markSkipped, markWatched } = useVideoEngagement();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [hasDismissed, setHasDismissed] = useState(false);
  const [pulse, setPulse] = useState(false);

  const nextVideo = useMemo(() => {
    return getNextVideoForContext(contextKey);
  }, [contextKey, getNextVideoForContext]);

  // Idle timer - show tray after 30 seconds of inactivity
  useEffect(() => {
    if (!nextVideo) return;

    let idleTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        // Show tray after idle period, even if previously dismissed
        setHasDismissed(false);
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
  }, [nextVideo]);

  useEffect(() => {
    if (nextVideo && !hasDismissed) {
      setPulse(true);
    } else {
      setPulse(false);
    }
  }, [nextVideo, hasDismissed]);

  useEffect(() => {
    if (showPlayer && nextVideo) {
      const id = extractYoutubeId(nextVideo.link);
      setCurrentVideoId(id);
    }
  }, [showPlayer, nextVideo]);

  const handleExpand = () => {
    if (!nextVideo) return;
    setIsCollapsed(false);
    setShowPlayer(false);
    setHasDismissed(false);
  };

  const handleCollapse = () => {
    setIsCollapsed(true);
    setShowPlayer(false);
  };

  const handleDismiss = () => {
    setHasDismissed(true);
    setIsCollapsed(true);
    setShowPlayer(false);
    if (nextVideo) {
      markSkipped(nextVideo);
    }
  };

  const handleSkip = () => {
    setShowPlayer(false);
    if (nextVideo) {
      markSkipped(nextVideo);
    }
  };

  const handlePlay = () => {
    if (!nextVideo) return;
    const id = extractYoutubeId(nextVideo.link);
    if (!id) return;
    setCurrentVideoId(id);
    setShowPlayer(true);
    setPulse(false);
  };

  const handleComplete = () => {
    if (nextVideo) {
      markWatched(nextVideo);
    }
    setShowPlayer(false);
  };

  // Don't auto-refresh when no video available
  // This prevents infinite retry loops when API returns errors
  // Videos are fetched once on mount by VideoEngagementContext
  
  if (loading || !nextVideo || hasDismissed) {
    return null;
  }

  return (
    <div className={cn('fixed bottom-7 right-7 z-50 flex flex-col items-end gap-3', className)}>
      <AnimatePresence>
        {isCollapsed && !showPlayer && (
          <motion.button
            key="collapsed"
            type="button"
            onClick={handleExpand}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className={cn(
              'relative flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-lg transition hover:border-primary/40 hover:shadow-xl',
              pulse && 'ring-2 ring-primary/60 ring-offset-2'
            )}
            aria-label="Open inspiration video suggestion"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">Need inspiration? Watch now</span>
            <Badge className="bg-primary/90 text-primary-foreground">New</Badge>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isCollapsed && !showPlayer && (
          <motion.div
            key="preview-card"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <p className="text-sm font-semibold text-gray-900">Inspiration Boost</p>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Dismiss suggestion"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900">{nextVideo.title}</p>
              <p className="mt-1 text-xs text-gray-500">{nextVideo.author}</p>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" onClick={handlePlay} className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch now
                </Button>
                <Button size="sm" variant="outline" onClick={handleSkip} className="gap-1">
                  <SkipForward className="h-4 w-4" />
                  Skip
                </Button>
              </div>
            </div>

            <div className="flex justify-between border-t border-gray-100 bg-gray-50 px-4 py-2">
              <button
                type="button"
                onClick={handleCollapse}
                className="text-xs font-medium text-gray-500 transition hover:text-gray-700"
              >
                Maybe later
              </button>
              <span className="text-xs text-gray-400">Keeps your progress</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPlayer && (
          <motion.div
            key="player-card"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Focused Inspiration</p>
                  <p className="text-xs text-gray-500">Stay in the flow</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPlayer(false)}
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {currentVideoId ? (
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={nextVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-gray-100">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}

            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">{nextVideo.title}</p>
              <p className="mt-1 text-xs text-gray-500">{nextVideo.author}</p>
              <div className="mt-3 flex items-center justify-between">
                <Button size="sm" variant="outline" onClick={handleSkip} className="gap-1">
                  <SkipForward className="h-4 w-4" />
                  Skip
                </Button>
                <Button size="sm" onClick={handleComplete} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
