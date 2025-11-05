import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface InvalidIdeaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  examples?: string[];
  template?: string;
}

export function InvalidIdeaDialog({ 
  isOpen, 
  onClose, 
  message, 
  examples = [],
  template 
}: InvalidIdeaDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Need a Clearer Business Idea</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {message}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Section - Only show if provided */}
          {template && template.trim() && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Suggested Template</h3>
                    <p className="text-sm text-blue-800 italic leading-relaxed">
                      "{template}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Examples Section - Only show if provided */}
          {examples.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                  ✓
                </span>
                Good Examples
              </h3>
              <div className="space-y-3">
                {examples.map((example, index) => (
                  <Card key={index} className="border-gray-200 hover:border-green-300 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed flex-1">
                          {example}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Fallback message if no examples or template provided */}
          {!template && examples.length === 0 && (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Please review your business idea and provide more specific details about what you want to start, 
                  where you want to operate, your target market, and any budget or timeline constraints.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tips Section */}
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-purple-900 mb-3">💡 Tips for a Clear Idea</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Be specific about what business you want to start</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Mention the location or target market</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Include budget or timeline if known</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Describe who your target customers are</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Got it, Let me try again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
