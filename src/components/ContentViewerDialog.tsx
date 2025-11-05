import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { X, ExternalLink, Video, FileText, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ContentViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    type: 'video' | 'article' | 'case-study' | 'case_study' | 'vendor' | 'success_story' | 'failure_story';
    title: string;
    source: string;
    url: string;
  } | null;
}

const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle youtu.be format
  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch) return youtuBeMatch[1];
  
  // Handle youtube.com/watch?v= format
  const youtubeMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) return youtubeMatch[1];
  
  // Handle youtube.com/embed/ format
  const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  
  return null;
};

const isYoutubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export function ContentViewerDialog({ isOpen, onClose, content }: ContentViewerDialogProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Small delay to show loading state
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, content]);

  if (!content) return null;

  const isVideo = content.type === 'video' || isYoutubeUrl(content.url);
  const youtubeId = isVideo ? extractYoutubeId(content.url) : null;

  const getIcon = () => {
    switch (content.type) {
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'article':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'case-study':
      case 'case_study':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {getIcon()}
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {content.title}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{content.source}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {isVideo && youtubeId ? (
            // YouTube Video Player
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-600">Loading video...</p>
                  </div>
                </div>
              )}
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={content.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            // Article/Content Iframe
            <div className="relative w-full h-[600px]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-600">Loading content...</p>
                  </div>
                </div>
              )}
              <iframe
                className="w-full h-full rounded-lg border border-gray-200"
                src={content.url}
                title={content.title}
                frameBorder="0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="capitalize">{content.type.replace('_', ' ')}</span>
            <span>•</span>
            <span>{content.source}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(content.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
