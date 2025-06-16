
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Folder, Link, Edit2, Save, X, Star } from 'lucide-react';
import { Note, useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';

interface NoteDetailDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NoteDetailDialog: React.FC<NoteDetailDialogProps> = ({ note, open, onOpenChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const { updateNote, isUpdating, toggleStar } = useNotes();
  const { toast } = useToast();

  React.useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags.join(', '));
    }
  }, [note]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'collection':
        return <Folder className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleSave = () => {
    if (!note) return;

    const tags = editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    updateNote({
      id: note.id,
      updates: {
        title: editTitle,
        content: editContent,
        tags,
      }
    }, {
      onSuccess: () => {
        setIsEditing(false);
        toast({
          title: "Note updated",
          description: "Your note has been successfully updated.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update note. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleToggleStar = () => {
    if (!note) return;
    
    toggleStar(note.id, {
      onSuccess: () => {
        toast({
          title: note.is_starred ? "Removed from favorites" : "Added to favorites",
          description: note.is_starred ? "Note removed from favorites." : "Note added to favorites.",
        });
      }
    });
  };

  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                {getTypeIcon(note.type)}
              </div>
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-lg font-semibold"
                />
              ) : (
                <DialogTitle className="text-lg">{note.title}</DialogTitle>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleStar}
                className="text-yellow-500 hover:text-yellow-600"
              >
                <Star className={`h-4 w-4 ${note.is_starred ? 'fill-current' : ''}`} />
              </Button>
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    disabled={isUpdating}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {note.image_url && (
            <div className="w-full">
              <img
                src={note.image_url}
                alt="Note"
                className="w-full max-h-64 object-contain rounded border border-border"
              />
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-2">Content</h3>
            {isEditing ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px]"
                placeholder="Write your note content..."
              />
            ) : (
              <div className="prose max-w-none text-sm text-muted-foreground whitespace-pre-wrap">
                {note.content}
              </div>
            )}
          </div>

          {note.ai_summary && (
            <div>
              <h3 className="text-sm font-medium mb-2">AI Summary</h3>
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                {note.ai_summary}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            {isEditing ? (
              <Input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {note.tags.length > 0 ? (
                  note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No tags</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
            <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
            <span>Updated: {new Date(note.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetailDialog;
