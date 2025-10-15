import { useState } from 'react';
import { FileEdit, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';

interface NotesButtonProps {
  itemId: string;
  itemType: string;
  onSaveNotes?: (notes: string) => void;
}

export function NotesButton({ itemId, itemType, onSaveNotes }: NotesButtonProps) {
  const [notes, setNotes] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (value.trim().length > 0 && !showWarning) {
      setShowWarning(true);
    }
  };

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(notes);
    }
    // In a real app, this would save to backend
    console.log('Saving notes:', notes);
    setIsOpen(false);
    setNotes('');
    setShowWarning(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowWarning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setShowWarning(false);
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
            Edit your notes and ideas for this {itemType}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {showWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> Editing notes might change the initial original IDEA. 
                This could affect your business plan and implementation. Please review carefully before saving.
              </AlertDescription>
            </Alert>
          )}
          
          <Textarea
            placeholder="Enter your notes here..."
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="flex-1 min-h-[400px] resize-none"
          />
        </div>
          
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNotes}
            variant={showWarning ? "destructive" : "default"}
          >
            {showWarning ? 'Save Changes Anyway' : 'Save Notes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
