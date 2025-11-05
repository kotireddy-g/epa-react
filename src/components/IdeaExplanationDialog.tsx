import { useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Youtube, PlayCircle, Sparkles } from 'lucide-react';
import { ProcessFlowTimeline } from './ProcessFlowTimeline';
import { Separator } from './ui/separator';
import type { VideoFeedItem } from '../services/ideaAnalysisApi';

interface IdeaExplanationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  videos?: VideoFeedItem[];
  loadingVideos?: boolean;
  videoError?: string;
  onRefreshVideos?: () => void;
  onShowInspiration?: (startIndex?: number) => void;
}

const FALLBACK_THUMBNAILS = [
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
];

const FALLBACK_VIDEOS = [
  {
    title: 'What is a Business Idea?',
    author: 'Y Combinator',
    thumbnail: FALLBACK_THUMBNAILS[0],
  },
  {
    title: 'How to Validate Your Idea',
    author: 'TechCrunch',
    thumbnail: FALLBACK_THUMBNAILS[1],
  },
  {
    title: 'From Idea to Execution',
    author: 'Stanford eCorner',
    thumbnail: FALLBACK_THUMBNAILS[2],
  },
];

const YT_URL_REGEX = /(?:v=|youtu\.be\/)([\w-]{11})/i;

const extractVideoId = (url?: string) => {
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

const getYoutubeThumbnail = (link?: string, fallback?: string) => {
  const videoId = extractVideoId(link);
  if (!videoId) return fallback || FALLBACK_THUMBNAILS[0];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export function IdeaExplanationDialog({
  isOpen,
  onClose,
  onContinue,
  videos,
  loadingVideos = false,
  videoError = '',
  onRefreshVideos,
  onShowInspiration,
}: IdeaExplanationDialogProps) {
  const curatedVideos = useMemo(() => {
    if (loadingVideos) return [];
    if (videos && videos.length > 0) {
      return videos.slice(0, 3).map((video, index) => ({
        title: video.title,
        author: video.author,
        link: video.link,
        thumbnail: getYoutubeThumbnail(video.link, FALLBACK_THUMBNAILS[index] || FALLBACK_THUMBNAILS[0]),
      }));
    }
    return FALLBACK_VIDEOS;
  }, [videos, loadingVideos]);

  const handleContinue = () => {
    onContinue();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[1400px] !h-[800px] !max-w-[1400px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Welcome to Your Business Journey</DialogTitle>
          <DialogDescription>
            Understand how this platform will guide you from idea to successful business
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 pb-4">
            {/* Process Flow Timeline */}
            <ProcessFlowTimeline />

            <Separator className="my-6" />

            {/* Educational Videos - Bottom Section in Row */}
            <div>
              <h3 className="text-gray-900 mb-4">Learn More - Suggested Videos</h3>
              {loadingVideos ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="animate-pulse flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-full h-32 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : videoError ? (
                <div className="flex flex-col items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <Sparkles className="w-4 h-4" />
                    Unable to fetch personalised videos right now. Showing our curated picks instead.
                  </div>
                  {onRefreshVideos && (
                    <Button size="sm" variant="outline" onClick={onRefreshVideos}>
                      Try fetching again
                    </Button>
                  )}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {curatedVideos.map((video, index) => (
                  <button
                    key={`${video.title}-${index}`}
                    onClick={() => onShowInspiration?.(index)}
                    className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors group text-left w-full"
                  >
                    <div className="relative flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <PlayCircle className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Youtube className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2" title={video.title}>
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{video.author}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Want more inspiration? Explore the full video lounge.
                </p>
                <Button variant="outline" onClick={() => onShowInspiration?.(0)}>
                  Open Inspiration Hub
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleContinue} size="lg">
            Continue to Create Idea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
