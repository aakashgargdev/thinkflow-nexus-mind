
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from './ImageUpload';

const CreateNoteDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'note' | 'collection' | 'link'>('note');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { createNote, isCreating } = useNotes();
  const { toast } = useToast();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setType('note');
    setTags([]);
    setTagInput('');
    setAiSummary('');
    setImageUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    createNote({
      title: title.trim(),
      content: content.trim(),
      type,
      tags: tags,
      ai_summary: aiSummary.trim() || null,
      image_url: imageUrl,
    }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Note created successfully",
        });
        setOpen(false);
        resetForm();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create note",
          variant: "destructive",
        });
        console.error('Error creating note:', error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Note content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div>
            <ImageUpload
              onImageUploaded={setImageUrl}
              currentImageUrl={imageUrl}
              onImageRemoved={() => setImageUrl(null)}
            />
          </div>

          <div>
            <Select value={type} onValueChange={(value: 'note' | 'collection' | 'link') => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="AI Summary (optional)"
              value={aiSummary}
              onChange={(e) => setAiSummary(e.target.value)}
            />
          </div>

          <div>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
