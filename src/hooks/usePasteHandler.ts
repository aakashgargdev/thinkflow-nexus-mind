import { useCallback, useEffect } from 'react';
import { useNotes } from './useNotes';
import { useToast } from './use-toast';

export const usePasteHandler = () => {
  const { createNote, uploadImage } = useNotes();
  const { toast } = useToast();

  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    // Only handle paste when not in an input field
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' || 
      (activeElement as HTMLElement).contentEditable === 'true'
    )) {
      return;
    }

    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    // Check for images first
    const items = Array.from(clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    
    if (imageItem) {
      event.preventDefault();
      await handleImagePaste(imageItem);
      return;
    }

    // Check for text/URLs
    const text = clipboardData.getData('text/plain');
    if (text.trim()) {
      event.preventDefault();
      await handleTextPaste(text.trim());
    }
  }, [createNote, uploadImage, toast]);

  const handleImagePaste = async (imageItem: DataTransferItem) => {
    try {
      const file = imageItem.getAsFile();
      if (!file) return;

      toast({
        title: "Processing image...",
        description: "Creating note with pasted image",
      });

      // Upload the image
      const imageUrl = await uploadImage(file);
      
      // Create note with image
      const timestamp = new Date().toLocaleString();
      createNote({
        title: `Screenshot - ${timestamp}`,
        content: 'Image pasted from clipboard',
        type: 'note',
        tags: ['screenshot', 'clipboard'],
        image_url: imageUrl,
      }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Note created with pasted image",
          });
        },
        onError: (error) => {
          console.error('Error creating note with image:', error);
          toast({
            title: "Error",
            description: "Failed to create note with image",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error('Error handling image paste:', error);
      toast({
        title: "Error",
        description: "Failed to process pasted image",
        variant: "destructive",
      });
    }
  };

  const handleTextPaste = async (text: string) => {
    try {
      const isUrl = isValidUrl(text);
      
      if (isUrl) {
        toast({
          title: "Processing link...",
          description: "Creating note with pasted URL",
        });

        // Try to fetch page title for URLs
        let title = `Link - ${new Date().toLocaleString()}`;
        let content = text;
        
        try {
          // Simple title extraction (this would work for same-origin or CORS-enabled sites)
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(text)}`);
          const data = await response.json();
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.contents, 'text/html');
          const pageTitle = doc.querySelector('title')?.textContent;
          
          if (pageTitle) {
            title = pageTitle.trim();
            content = `${text}\n\nPage Title: ${pageTitle}`;
          }
        } catch (e) {
          // Fallback if title fetch fails
          console.log('Could not fetch page title, using URL as title');
        }

        createNote({
          title,
          content,
          type: 'link',
          tags: ['clipboard', 'link'],
        }, {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Note created with pasted link",
            });
          },
          onError: (error) => {
            console.error('Error creating note with link:', error);
            toast({
              title: "Error",
              description: "Failed to create note with link",
              variant: "destructive",
            });
          },
        });
      } else {
        // Regular text paste
        toast({
          title: "Processing text...",
          description: "Creating note with pasted content",
        });

        const timestamp = new Date().toLocaleString();
        createNote({
          title: `Note - ${timestamp}`,
          content: text,
          type: 'note',
          tags: ['clipboard', 'text'],
        }, {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Note created with pasted text",
            });
          },
          onError: (error) => {
            console.error('Error creating note with text:', error);
            toast({
              title: "Error",
              description: "Failed to create note with text",
              variant: "destructive",
            });
          },
        });
      }
    } catch (error) {
      console.error('Error handling text paste:', error);
      toast({
        title: "Error",
        description: "Failed to process pasted content",
        variant: "destructive",
      });
    }
  };

  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return { handlePaste };
};
