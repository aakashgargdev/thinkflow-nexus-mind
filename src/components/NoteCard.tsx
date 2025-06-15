
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, Folder, Link } from 'lucide-react';

interface NoteCardProps {
  note: {
    id: number;
    title: string;
    content: string;
    tags: string[];
    type: string;
    createdAt: string;
    aiSummary: string;
    imageUrl?: string | null;
  };
  viewMode: 'grid' | 'list';
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode }) => {
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

  if (viewMode === 'list') {
    return (
      <Card className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="text-muted-foreground flex-shrink-0">
                {getTypeIcon(note.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate text-sm sm:text-base">{note.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1 sm:line-clamp-2">{note.aiSummary}</p>
                {note.imageUrl && (
                  <img
                    src={note.imageUrl}
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
                {note.createdAt}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2 flex-shrink-0">
              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
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
              {note.createdAt}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group cursor-pointer h-full flex flex-col">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="text-muted-foreground flex-shrink-0">
              {getTypeIcon(note.type)}
            </div>
            <h3 className="font-semibold line-clamp-2 text-sm sm:text-base leading-tight">{note.title}</h3>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2 flex-shrink-0">
            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        {note.imageUrl && (
          <div className="mb-3 sm:mb-4">
            <img
              src={note.imageUrl}
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
            <span>{note.createdAt}</span>
            <span className="bg-muted/50 px-2 py-1 rounded text-xs hidden sm:inline">
              AI Enhanced
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
