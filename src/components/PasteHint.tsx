
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, X, Keyboard } from 'lucide-react';

const PasteHint = () => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('pasteHintDismissed') === 'true';
  });

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pasteHintDismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Clipboard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Quick Paste Feature</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Ctrl+V</kbd> anywhere to instantly create notes with:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 📸 Screenshots and images</li>
                <li>• 🔗 URLs and links</li>
                <li>• 📝 Text content</li>
              </ul>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasteHint;
