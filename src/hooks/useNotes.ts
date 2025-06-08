
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define Note types manually since the table was just created
export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  type: 'note' | 'collection' | 'link';
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags: string[];
  type: 'note' | 'collection' | 'link';
  ai_summary?: string | null;
}

export const useNotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
      return data as Note[];
    },
    enabled: !!user,
  });

  const createNoteMutation = useMutation({
    mutationFn: async (newNote: CreateNoteInput) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...newNote,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        throw error;
      }
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    error: notesQuery.error,
    createNote: createNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
  };
};
