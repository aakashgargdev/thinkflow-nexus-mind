
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, BookOpen } from "lucide-react";
import CreateNoteDialog from "@/components/CreateNoteDialog";
import NoteCard from "@/components/NoteCard";
import { Note } from "@/hooks/useNotes";

interface NotesTabProps {
  notesLoading: boolean;
  notes: Note[];
}

const NotesTab: React.FC<NotesTabProps> = ({ notesLoading, notes }) => (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-xl sm:text-2xl font-semibold">All Notes</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Filter
        </Button>
        <CreateNoteDialog />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {notes.length === 0 ? (
        <div className="col-span-full text-center py-8 sm:py-12">
          <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            {notesLoading ? 'Loading your notes...' : 'No notes yet. Create your first note!'}
          </p>
          <CreateNoteDialog />
        </div>
      ) : (
        notes.map((note) => (
          <NoteCard key={note.id} note={note} viewMode="grid" />
        ))
      )}
    </div>
  </div>
);

export default NotesTab;
