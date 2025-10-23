import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Youtube, PlayCircle } from 'lucide-react';
import { ProcessFlowTimeline } from './ProcessFlowTimeline';
import { Separator } from './ui/separator';

interface IdeaExplanationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function IdeaExplanationDialog({ isOpen, onClose, onContinue }: IdeaExplanationDialogProps) {
  const videos = [
    {
      title: 'What is a Business Idea?',
      source: 'Y Combinator',
      thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=225&fit=crop',
    },
    {
      title: 'How to Validate Your Idea',
      source: 'TechCrunch',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=225&fit=crop',
    },
    {
      title: 'From Idea to Execution',
      source: 'Stanford eCorner',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
    },
  ];

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videos.map((video, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded group-hover:bg-black/30 transition-colors">
                        <PlayCircle className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Youtube className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2" title={video.title}>
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{video.source}</p>
                      </div>
                    </div>
                  </a>
                ))}
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
