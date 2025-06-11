
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Clipboard, Image, Link } from 'lucide-react';

const PasteIndicator = () => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [pasteType, setPasteType] = useState<'text' | 'image' | 'link'>('text');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        setShowIndicator(true);
        // Try to detect paste type from clipboard
        navigator.clipboard.read().then(items => {
          const hasImage = items.some(item => 
            item.types.some(type => type.startsWith('image/'))
          );
          if (hasImage) {
            setPasteType('image');
          } else {
            navigator.clipboard.readText().then(text => {
              try {
                new URL(text);
                setPasteType('link');
              } catch {
                setPasteType('text');
              }
            }).catch(() => setPasteType('text'));
          }
        }).catch(() => setPasteType('text'));

        setTimeout(() => setShowIndicator(false), 2000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!showIndicator) return null;

  const getIcon = () => {
    switch (pasteType) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      default: return <Clipboard className="h-4 w-4" />;
    }
  };

  const getMessage = () => {
    switch (pasteType) {
      case 'image': return 'Creating note with image...';
      case 'link': return 'Creating note with link...';
      default: return 'Creating note with text...';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2">
      <Card className="p-3 bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium">{getMessage()}</span>
        </div>
      </Card>
    </div>
  );
};

export default PasteIndicator;
