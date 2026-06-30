import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import { ArrowLeft, LoaderCircle, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/FileUpload';

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.error("An error occured while fetching note", error);
        toast.error("Failed to load note", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id]); // This page will render everytime there's id note

  // const handleImageUpload = (url) => {
  //   setNote((prev) => ({ ...prev, image: url}));
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <LoaderCircle className='animate-spin size-10 text-muted-foreground' />
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully.");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete note", error);
      console.error("An error occured while deleting note.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', note.title);
    formData.append('content', note.content);
    if (file) {
      formData.append("image", file);
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, formData);
      toast.success("Note updated successfully.");
      navigate(`/`);
    } catch (error) {
      toast.error("Failed to update note", error);
      console.error("An error occured while updating note.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-muted/40 p-4'>
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className='mr-2 size-4' /> Back to Notes
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2Icon className='mr-2 size-4' />
            {saving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Deleting..." : "Delete Note"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Edit Note</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Image upload */}
              <div>
                <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                {loading ? (
                  <LoaderCircle className="animate-spin mt-2 text-primary" size={24} />
                ) : (
                  note.image && <img src={note.image} alt="Note attachment" className="max-w-xs mt-2" />
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Field>
                  <FieldLabel htmlFor="input-field-title">Title</FieldLabel>
                  <Input
                    id="input-field-title"
                    type="text"
                    placeholder="Note title"
                    value={note.title}
                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                  />
                </Field>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Field>
                  <FieldLabel htmlFor="textarea-message">Content</FieldLabel>
                  <Textarea
                    id="textarea-message"
                    placeholder="What is your note all about?"
                    value={note.content}
                    onChange={(e) => setNote({ ...note, content: e.target.value })}
                    className="min-h-37.5"
                  />
                </Field>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button disabled={saving} type="submit">
                {saving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div >
  )
};

export default NoteDetailPage
