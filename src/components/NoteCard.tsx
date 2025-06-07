
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
  };
  viewMode: 'grid' | 'list';
}

const NoteCard: React.FC<NoteCardProps> = ({ note, viewMode }) => {
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

  if (viewMode === 'list') {
    return (
      <Card className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-muted-foreground">
                {getTypeIcon(note.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{note.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{note.aiSummary}</p>
              </div>
              <div className="flex items-center gap-2">
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
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {note.createdAt}
              </span>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">
              {getTypeIcon(note.type)}
            </div>
            <h3 className="font-semibold line-clamp-1">{note.title}</h3>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {note.content}
        </p>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{note.createdAt}</span>
            <span className="bg-muted/50 px-2 py-1 rounded text-xs">
              AI Enhanced
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
