
-- Create the note-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('note-images', 'note-images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Users can upload their own images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'note-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow public read access to images
CREATE POLICY "Anyone can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'note-images');

-- Create policy to allow users to update their own images
CREATE POLICY "Users can update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'note-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own images
CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'note-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add image_url column to notes table if it doesn't exist
ALTER TABLE notes ADD COLUMN IF NOT EXISTS image_url TEXT;
