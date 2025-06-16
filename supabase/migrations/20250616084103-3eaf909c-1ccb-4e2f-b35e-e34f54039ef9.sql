
-- Add is_starred column to notes table for favorite functionality
ALTER TABLE public.notes 
ADD COLUMN is_starred BOOLEAN NOT NULL DEFAULT false;

-- Create an index for better performance when filtering starred notes
CREATE INDEX idx_notes_is_starred ON public.notes(user_id, is_starred) WHERE is_starred = true;
