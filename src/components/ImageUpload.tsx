
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNotes } from "@/hooks/useNotes";

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string | null;
  onImageRemoved?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImageUrl, 
  onImageRemoved 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImage } = useNotes();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      onImageUploaded(imageUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Uploaded"
            className="max-w-full h-auto rounded-lg border border-border"
            style={{ maxHeight: '300px' }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-background/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <Upload className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Image className="h-4 w-4 mr-2" />
          )}
          {isUploading ? 'Uploading...' : 'Add Image'}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
