import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import api from '@/lib/axios';
import RateLimiterUI from '@/components/RateLimiterUI';

const HomePage = () => {
  const [rateLimited, setRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await api.get("/notes"); // Get the data
        console.log("Notes:", res.data);
        setNotes(res.data); // Store the data to state
        setRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response?.status === 429) {
          setRateLimited(true);
        } else {
          toast.error("Failed to load notes.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className='min-h-screen'>
      <Navbar />

      {rateLimited && <RateLimiterUI />}

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading &&
          <div className='py-10'>
            <LoaderCircle className="h-2 w-2 animate-spin" />
            Loading...
          </div>
        }

        {notes.length > 0 && !rateLimited && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default HomePage