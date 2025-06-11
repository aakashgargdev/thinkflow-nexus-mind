
import React, { useState, useEffect } from 'react';
import { Search, Brain, BookOpen, MessageSquare, Plus, Filter, Grid, List, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import NoteCard from '@/components/NoteCard';
import ChatInterface from '@/components/ChatInterface';
import QuickActions from '@/components/QuickActions';
import Profile from '@/components/Profile';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import PasteIndicator from '@/components/PasteIndicator';
import PasteHint from '@/components/PasteHint';
import { useNotes } from '@/hooks/useNotes';
import { usePasteHandler } from '@/hooks/usePasteHandler';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { notes, isLoading: notesLoading } = useNotes();
  
  // Initialize paste handler
  usePasteHandler();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Brain className="h-5 w-5 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Transform notes data to match NoteCard expectations
  const transformedNotes = notes.map(note => ({
    id: parseInt(note.id.slice(-8), 16), // Convert UUID to number for display
    title: note.title,
    content: note.content,
    tags: note.tags || [],
    type: note.type,
    createdAt: new Date(note.created_at).toLocaleDateString(),
    aiSummary: note.ai_summary || 'No AI summary available',
    imageUrl: note.image_url
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PasteIndicator />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Your Knowledge Universe
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Capture, organize, and chat with your thoughts
              </p>
            </div>
            <QuickActions />
          </div>

          {/* Paste Hint */}
          <PasteHint />

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your knowledge base or ask a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base bg-card border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-lg">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {notesLoading ? 'Loading...' : 'Real notes from database'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">AI Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">+8 today</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">Auto-organized</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 hover:border-border transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">AI-discovered</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Your Notes {notesLoading && <span className="text-sm text-muted-foreground">(Loading...)</span>}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transformedNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {notesLoading ? 'Loading your notes...' : 'No notes yet. Create your first note to get started!'}
                    </p>
                    <CreateNoteDialog />
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                    {transformedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} viewMode={viewMode} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">All Notes</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <CreateNoteDialog />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedNotes.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {notesLoading ? 'Loading your notes...' : 'No notes yet. Create your first note!'}</p>
                  <CreateNoteDialog />
                </div>
              ) : (
                transformedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} viewMode="grid" />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Knowledge Patterns</h3>
                    <p className="text-muted-foreground">You frequently connect AI research with design principles. Consider exploring AI-driven design tools.</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Content Gaps</h3>
                    <p className="text-muted-foreground">Your notes lack implementation examples. Adding code snippets could enhance understanding.</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Trending Topics</h3>
                    <p className="text-muted-foreground">LLM applications and RAG systems appear most frequently in your recent notes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Profile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
