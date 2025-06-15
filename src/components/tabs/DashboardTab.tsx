
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid, List, BookOpen } from "lucide-react";
import NoteCard from "@/components/NoteCard";
import CreateNoteDialog from "@/components/CreateNoteDialog";

interface DashboardTabProps {
  notesLoading: boolean;
  notes: any[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  notesLoading,
  notes,
  viewMode,
  setViewMode
}) => (
  <div className="space-y-4 sm:space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{notes.length}</div>
          <p className="text-xs text-muted-foreground">
            {notesLoading ? 'Loading...' : 'Real notes from database'}
          </p>
        </CardContent>
      </Card>
      <Card className="border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">AI Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">45</div>
          <p className="text-xs text-muted-foreground">+8 today</p>
        </CardContent>
      </Card>
      <Card className="border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">Auto-organized</p>
        </CardContent>
      </Card>
      <Card className="border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">89</div>
          <p className="text-xs text-muted-foreground">AI-discovered</p>
        </CardContent>
      </Card>
    </div>
    {/* Recent Activity */}
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            Your Notes {notesLoading && <span className="text-sm text-muted-foreground">(Loading...)</span>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            >
              <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:ml-2 sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            >
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:ml-2 sm:inline">List</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              {notesLoading ? 'Loading your notes...' : 'No notes yet. Create your first note to get started!'}
            </p>
            <CreateNoteDialog />
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} viewMode={viewMode} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

export default DashboardTab;
