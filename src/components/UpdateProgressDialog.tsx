import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Card } from './ui/card';

interface UpdateProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  onSave: (updateData: UpdateData) => void;
}

export interface UpdateData {
  implementation: string;
  valueAdded: string;
  positivePercentage: number;
  negativePercentage: number;
  positiveFeedback: string;
  negativeFeedback: string;
}

export function UpdateProgressDialog({ isOpen, onClose, itemName, onSave }: UpdateProgressDialogProps) {
  const [updateData, setUpdateData] = useState<UpdateData>({
    implementation: '',
    valueAdded: '',
    positivePercentage: 50,
    negativePercentage: 50,
    positiveFeedback: '',
    negativeFeedback: '',
  });

  const handleSave = () => {
    onSave(updateData);
    onClose();
    // Reset form
    setUpdateData({
      implementation: '',
      valueAdded: '',
      positivePercentage: 50,
      negativePercentage: 50,
      positiveFeedback: '',
      negativeFeedback: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[1400px] !h-[800px] !max-w-[1400px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Update Progress: {itemName}</DialogTitle>
          <DialogDescription>
            Share how you implemented this plan in real life and the results
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 pb-4">
          {/* Implementation */}
          <div className="space-y-2">
            <Label htmlFor="implementation">
              How did you implement the plan in real life?
            </Label>
            <Textarea
              id="implementation"
              placeholder="Describe the steps you took to implement this plan..."
              value={updateData.implementation}
              onChange={(e) => setUpdateData({ ...updateData, implementation: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          {/* Value Added */}
          <div className="space-y-2">
            <Label htmlFor="valueAdded">
              How did this add value to your initial idea?
            </Label>
            <Textarea
              id="valueAdded"
              placeholder="Explain the value and impact this brought to your idea..."
              value={updateData.valueAdded}
              onChange={(e) => setUpdateData({ ...updateData, valueAdded: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          {/* Positive Feedback */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="positivePercentage" className="text-green-700">
                  Positive Feedback Percentage: {updateData.positivePercentage}%
                </Label>
                <Slider
                  id="positivePercentage"
                  value={[updateData.positivePercentage]}
                  onValueChange={(value) => setUpdateData({ ...updateData, positivePercentage: value[0] })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="positiveFeedback" className="text-green-700">
                  What positive results did you see?
                </Label>
                <Textarea
                  id="positiveFeedback"
                  placeholder="Describe the positive outcomes, benefits, and successes..."
                  value={updateData.positiveFeedback}
                  onChange={(e) => setUpdateData({ ...updateData, positiveFeedback: e.target.value })}
                  className="min-h-[80px] bg-white"
                />
              </div>
            </div>
          </Card>

          {/* Negative Feedback */}
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="negativePercentage" className="text-red-700">
                  Negative Feedback Percentage: {updateData.negativePercentage}%
                </Label>
                <Slider
                  id="negativePercentage"
                  value={[updateData.negativePercentage]}
                  onValueChange={(value) => setUpdateData({ ...updateData, negativePercentage: value[0] })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="negativeFeedback" className="text-red-700">
                  What challenges or issues did you face?
                </Label>
                <Textarea
                  id="negativeFeedback"
                  placeholder="Describe the challenges, setbacks, and areas for improvement..."
                  value={updateData.negativeFeedback}
                  onChange={(e) => setUpdateData({ ...updateData, negativeFeedback: e.target.value })}
                  className="min-h-[80px] bg-white"
                />
              </div>
            </div>
          </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
