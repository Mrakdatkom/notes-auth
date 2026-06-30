import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/axios';
import { ArrowLeft, LoaderCircle, MessageCircleWarningIcon } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

const CreateNotePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/notes`, { title, content });
      toast.success("Note created successfully.");

      // Clear the fields after successfull creation
      setTitle("");
      setContent("");
      setLoading(false);
      navigate("/");
    } catch (error) {
      toast.error("Failed to create note, please try again.");

      if (error.response?.status === 429) {
        toast.error("Too much request. Try again later.", {
          duration: 3000,
          icon: <MessageCircleWarningIcon />
        });
      } else {
        toast.error("Failed to create note.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-muted/40 p-4'>
      <div className="w-full max-w-xl">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className='mr-2 size-4' /> Back to Notes
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Note</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Field>
                  <FieldLabel htmlFor="input-field-title">Title</FieldLabel>
                  <Input
                    id="input-field-title"
                    type="text"
                    placeholder="Enter a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Field>
                  <FieldLabel htmlFor="textarea-message">Content</FieldLabel>
                  <Textarea
                    id="textarea-message"
                    placeholder="Type your content description here."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-37.5"
                  />
                </Field>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Creating..." : "Create Note"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div >
    </div >
  )
}

export default CreateNotePage
