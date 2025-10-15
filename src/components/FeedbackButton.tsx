import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface FeedbackButtonProps {
  itemId: string;
  itemType: string;
  onSaveFeedback?: (feedback: string) => void;
}

export function FeedbackButton({ itemId, itemType, onSaveFeedback }: FeedbackButtonProps) {
  const [feedback, setFeedback] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveFeedback = () => {
    if (onSaveFeedback) {
      onSaveFeedback(feedback);
    }
    // In a real app, this would save to backend
    console.log('Saving feedback:', feedback);
    setIsOpen(false);
    setFeedback('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="w-4 h-4" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[1400px] !h-[800px] !max-w-[1400px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Share Feedback</DialogTitle>
          <DialogDescription>
            Share your feedback about this {itemType}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <Textarea
            placeholder="Enter your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="flex-1 min-h-[400px] resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveFeedback}>
            Save Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
