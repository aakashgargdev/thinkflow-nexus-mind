
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  FileText, 
  Folder, 
  Link, 
  Star, 
  Edit, 
  Trash2, 
  Copy,
  StarIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note, useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';
import NoteDetailDialog from './NoteDetailDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface NoteCardProps {
  note: Note;
  viewMode: 'grid' | 'list';
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteNote, isDeleting, toggleStar, duplicateNote, isDuplicating } = useNotes();
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'collection':
        return <Folder className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'link':
        return <Link className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <FileText className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening detail when clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    setShowDetail(true);
  };

  const handleDelete = () => {
    deleteNote(note.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        toast({
          title: "Note deleted",
          description: "Your note has been successfully deleted.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete note. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleToggleStar = () => {
    toggleStar(note.id, {
      onSuccess: () => {
        toast({
          title: note.is_starred ? "Removed from favorites" : "Added to favorites",
          description: note.is_starred ? "Note removed from favorites." : "Note added to favorites.",
        });
      }
    });
  };

  const handleDuplicate = () => {
    duplicateNote(note.id, {
      onSuccess: () => {
        toast({
          title: "Note duplicated",
          description: "A copy of your note has been created.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to duplicate note. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (viewMode === 'list') {
    return (
      <>
        <Card 
          className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md cursor-pointer"
          onClick={handleCardClick}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="text-muted-foreground flex-shrink-0">
                  {getTypeIcon(note.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate text-sm sm:text-base">{note.title}</h3>
                    {note.is_starred && (
                      <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1 sm:line-clamp-2">{note.ai_summary || note.content}</p>
                  {note.image_url && (
                    <img
                      src={note.image_url}
                      alt="Note"
                      className="mt-2 max-h-12 sm:max-h-16 rounded border border-border object-cover"
                    />
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  {note.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{note.tags.length - 2}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap hidden lg:block">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild data-dropdown-trigger>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2 flex-shrink-0">
                    <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDetail(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleToggleStar}>
                    <StarIcon className={`mr-2 h-4 w-4 ${note.is_starred ? 'fill-current text-yellow-500' : ''}`} />
                    {note.is_starred ? 'Unstar' : 'Star'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Mobile tags and date */}
            <div className="sm:hidden mt-3 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(note.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <NoteDetailDialog 
          note={note}
          open={showDetail}
          onOpenChange={setShowDetail}
        />

        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          noteTitle={note.title}
          isLoading={isDeleting}
        />
      </>
    );
  }

  return (
    <>
      <Card 
        className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group cursor-pointer h-full flex flex-col"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="text-muted-foreground flex-shrink-0">
                {getTypeIcon(note.type)}
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2 text-sm sm:text-base leading-tight">{note.title}</h3>
                {note.is_starred && (
                  <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild data-dropdown-trigger>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2 flex-shrink-0">
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetail(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleStar}>
                  <StarIcon className={`mr-2 h-4 w-4 ${note.is_starred ? 'fill-current text-yellow-500' : ''}`} />
                  {note.is_starred ? 'Unstar' : 'Star'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col">
          {note.image_url && (
            <div className="mb-3 sm:mb-4">
              <img
                src={note.image_url}
                alt="Note"
                className="w-full h-24 sm:h-32 object-cover rounded border border-border"
              />
            </div>
          )}
          
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3 sm:mb-4 flex-1">
            {note.content}
          </p>
          
          <div className="space-y-2 sm:space-y-3 mt-auto">
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(note.created_at).toLocaleDateString()}</span>
              <span className="bg-muted/50 px-2 py-1 rounded text-xs hidden sm:inline">
                AI Enhanced
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <NoteDetailDialog 
        note={note}
        open={showDetail}
        onOpenChange={setShowDetail}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        noteTitle={note.title}
        isLoading={isDeleting}
      />
    </>
  );
};

export default NoteCard;
