import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Youtube, Sparkles, PlayCircle, ChevronRight, Loader2, X } from 'lucide-react';
import type { VideoFeedItem } from '../services/ideaAnalysisApi';

interface VideoEngageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoFeedItem[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  initialIndex?: number;
  onCompleted?: (video: VideoFeedItem) => void;
}

const YT_URL_REGEX = /(?:v=|youtu\.be\/)([\w-]{11})/i;

const extractVideoId = (url: string) => {
  if (!url) return '';
  const match = url.match(YT_URL_REGEX);
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
};

const buildEmbedUrl = (videoId: string) => {
  if (!videoId) return '';
  const params = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1' });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

export function VideoEngageDialog({
  isOpen,
  onClose,
  videos,
  loading = false,
  error = '',
  onRetry,
  initialIndex = 0,
  onCompleted,
}: VideoEngageDialogProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setCompleted({});
      setActiveIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const orderedVideos = useMemo(() => {
    if (!videos) return [];
    const seen = new Set<string>();
    const combined: VideoFeedItem[] = [];
    for (const item of videos) {
      if (!item?.link) continue;
      const id = extractVideoId(item.link);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      combined.push(item);
    }
    return combined;
  }, [videos]);

  useEffect(() => {
    if (activeIndex >= orderedVideos.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, orderedVideos.length]);

  const handleSkip = () => {
    setActiveIndex(prev => (prev + 1) % Math.max(orderedVideos.length || 1, 1));
  };

  const handleCompletion = () => {
    setCompleted(prev => ({ ...prev, [activeIndex]: true }));
    const video = orderedVideos[activeIndex];
    onCompleted?.(video);
    handleSkip();
  };

  const handleClose = () => {
    setActiveIndex(initialIndex);
    setCompleted({});
    onClose();
  };

  const currentVideo = orderedVideos[activeIndex];
  const currentVideoId = currentVideo ? extractVideoId(currentVideo.link) : '';
  const embedUrl = buildEmbedUrl(currentVideoId);

  const recommendedVideos = orderedVideos.filter((_, idx) => idx !== activeIndex).slice(0, 4);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  Founders Inspiration Hub
                </DialogTitle>
                <DialogDescription className="mt-1 text-gray-600">
                  Curated YouTube insights to accelerate your business journey. Watch, learn, and keep building.
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close videos">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <Separator />

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[420px] gap-3 text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Fetching your personalised video feed...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-[420px] gap-3 text-red-600">
                <Youtube className="w-10 h-10" />
                <span>{error}</span>
                {onRetry && (
                  <Button variant="outline" onClick={onRetry}>
                  Retry
                </Button>
                )}
              </div>
            ) : orderedVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[420px] gap-3 text-gray-600">
                <Youtube className="w-10 h-10" />
                <span>No videos available right now. Check back soon!</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-[2fr_1fr] gap-6 px-6 py-6">
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-black">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        className="w-full aspect-video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={currentVideo?.title || 'YouTube video player'}
                      />
                    ) : (
                      <div className="w-full aspect-video flex items-center justify-center text-white/80 text-sm">
                        Video unavailable
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Youtube className="w-3 h-3 text-red-500" />
                        YouTube
                      </Badge>
                      <span className="text-xs text-gray-500">Episode {activeIndex + 1} of {orderedVideos.length}</span>
                      {completed[activeIndex] && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                      {currentVideo?.title || 'Untitled Video'}
                    </h2>
                    <p className="text-sm text-gray-500">By {currentVideo?.author || 'Unknown creator'}</p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={handleSkip}>
                      Skip &amp; Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button onClick={handleCompletion} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Mark as Completed
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Recommended next
                  </div>
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {recommendedVideos.map((video, idx) => {
                        const videoId = extractVideoId(video.link);
                        const displayIndex = orderedVideos.findIndex(item => extractVideoId(item.link) === videoId);
                        const isCompleted = completed[displayIndex];

                        return (
                          <motion.button
                            key={video.link}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                            onClick={() => setActiveIndex(displayIndex)}
                            className={`w-full text-left p-3 rounded-lg border transition-all hover:border-red-300 hover:bg-red-50 ${
                              isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                                <PlayCircle className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-2">{video.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{video.author}</p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleSkip}>
              Continue Exploring
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
