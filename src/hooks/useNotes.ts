
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
  image_url: string | null;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags: string[];
  type: 'note' | 'collection' | 'link';
  ai_summary?: string | null;
  image_url?: string | null;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  type?: 'note' | 'collection' | 'link';
  ai_summary?: string | null;
  image_url?: string | null;
  is_starred?: boolean;
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

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateNoteInput }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating note:', error);
        throw error;
      }
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  const toggleStarMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      // First get the current state
      const { data: currentNote, error: fetchError } = await supabase
        .from('notes')
        .select('is_starred')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching note:', fetchError);
        throw fetchError;
      }

      // Toggle the star
      const { data, error } = await supabase
        .from('notes')
        .update({ is_starred: !currentNote.is_starred })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling star:', error);
        throw error;
      }
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  const duplicateNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      // First get the note to duplicate
      const { data: originalNote, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching note:', fetchError);
        throw fetchError;
      }

      // Create a copy
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: `${originalNote.title} (Copy)`,
          content: originalNote.content,
          tags: originalNote.tags,
          type: originalNote.type,
          ai_summary: originalNote.ai_summary,
          image_url: originalNote.image_url,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error duplicating note:', error);
        throw error;
      }
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('note-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('note-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    error: notesQuery.error,
    createNote: createNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
    updateNote: updateNoteMutation.mutate,
    isUpdating: updateNoteMutation.isPending,
    deleteNote: deleteNoteMutation.mutate,
    isDeleting: deleteNoteMutation.isPending,
    toggleStar: toggleStarMutation.mutate,
    isTogglingStar: toggleStarMutation.isPending,
    duplicateNote: duplicateNoteMutation.mutate,
    isDuplicating: duplicateNoteMutation.isPending,
    uploadImage,
  };
};
