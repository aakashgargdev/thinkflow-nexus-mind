
import React, { useState, useEffect } from 'react';
// Alias Lucide icons to avoid conflicts with local components
import { Search, Brain, BookOpen, MessageSquare, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import QuickActions from '@/components/QuickActions';
import PasteIndicator from '@/components/PasteIndicator';
import PasteHint from '@/components/PasteHint';
import { useNotes } from '@/hooks/useNotes';
import { usePasteHandler } from '@/hooks/usePasteHandler';

import DashboardTab from "@/components/tabs/DashboardTab";
import NotesTab from "@/components/tabs/NotesTab";
import ChatTab from "@/components/tabs/ChatTab";
import InsightsTab from "@/components/tabs/InsightsTab";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Brain className="h-5 w-5 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading...</p>
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
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Your Knowledge Universe
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">
                  Capture, organize, and chat with your thoughts
                </p>
              </div>
              <div className="flex justify-center sm:justify-end">
                <QuickActions />
              </div>
            </div>
          </div>

          {/* Paste Hint */}
          <div className="mb-4 sm:mb-6">
            <PasteHint />
          </div>

          {/* Search Bar */}
          <div className="relative max-w-full sm:max-w-2xl mx-auto sm:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your knowledge base or ask a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 sm:h-12 text-sm sm:text-base bg-card border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 min-w-max sm:max-w-2xl mx-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">AI Chat</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <DashboardTab
              notesLoading={notesLoading}
              notes={transformedNotes}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </TabsContent>
          <TabsContent value="notes" className="space-y-4 sm:space-y-6">
            <NotesTab notesLoading={notesLoading} notes={transformedNotes} />
          </TabsContent>
          <TabsContent value="chat" className="space-y-4 sm:space-y-6">
            <ChatTab />
          </TabsContent>
          <TabsContent value="insights" className="space-y-4 sm:space-y-6">
            <InsightsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
