
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, Folder, Link, Camera, Mic } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const QuickActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <FileText className="h-4 w-4 mr-2" />
          New Note
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Folder className="h-4 w-4 mr-2" />
          New Collection
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="h-4 w-4 mr-2" />
          Save Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Camera className="h-4 w-4 mr-2" />
          Capture Image
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mic className="h-4 w-4 mr-2" />
          Voice Note
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickActions;
