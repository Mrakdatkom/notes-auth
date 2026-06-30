import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';

export default function FileUpload({ noteId, onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);   // must match the multer field name

    setUploading(true);
    try {
      const res = await api.post(`/notes/${noteId}/upload`, formData);
      toast.success('Image uploaded');
      setFile(null);
      if (onUpload) onUpload(res.data.image);  // tell the parent the new URL
    } catch (err) {
      toast.error('Upload failed');
      console.error("Something went wrong", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <Button type="submit" disabled={!file || uploading}>
        {uploading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </form>
  );
}