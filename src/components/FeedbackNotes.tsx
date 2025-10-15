import { useState } from 'react';
import { MessageSquare, FileEdit, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';

interface FeedbackNotesProps {
  itemId: string;
  itemType: string;
  onSaveFeedback?: (feedback: string) => void;
  onSaveNotes?: (notes: string) => void;
}

export function FeedbackNotes({ itemId, itemType, onSaveFeedback, onSaveNotes }: FeedbackNotesProps) {
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [showNotesWarning, setShowNotesWarning] = useState(false);

  const handleSaveFeedback = () => {
    if (onSaveFeedback) {
      onSaveFeedback(feedback);
    }
    // In a real app, this would save to backend
    console.log('Saving feedback:', feedback);
    setIsFeedbackOpen(false);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (value.length > 0 && !showNotesWarning) {
      setShowNotesWarning(true);
    }
  };

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(notes);
    }
    // In a real app, this would save to backend
    console.log('Saving notes:', notes);
    setIsNotesOpen(false);
    setShowNotesWarning(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Feedback
          </Button>
        </DialogTrigger>
        <DialogContent className="!w-[1400px] !h-[800px] !max-w-[1400px] max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>
              Share your feedback about this {itemType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <p className="text-sm text-gray-600">
              Your feedback helps us improve your experience
            </p>
            <Textarea
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="flex-1 min-h-[400px] resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFeedback}>
              Save Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={(open) => {
        setIsNotesOpen(open);
        if (!open) {
          setShowNotesWarning(false);
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FileEdit className="w-4 h-4" />
            Notes
          </Button>
        </DialogTrigger>
        <DialogContent className="!w-[1400px] !h-[800px] !max-w-[1400px] max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>
              Add or edit your notes for this {itemType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            {showNotesWarning && (
              <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-800">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Warning:</strong> Editing notes might change the initial original IDEA. This could affect your business plan and implementation. Please review carefully before saving.
                </AlertDescription>
              </Alert>
            )}
            
            <p className="text-sm text-gray-600">
              Edit your notes and ideas for this {itemType}
            </p>
            <Textarea
              placeholder="Enter your notes here..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="flex-1 min-h-[400px] resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsNotesOpen(false);
              setShowNotesWarning(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes} variant={showNotesWarning ? "destructive" : "default"}>
              {showNotesWarning ? 'Save Changes Anyway' : 'Save Notes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
