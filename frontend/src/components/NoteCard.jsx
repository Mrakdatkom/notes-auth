import { PenSquareIcon, TrashIcon } from 'lucide-react'
import { Link } from 'react-router'
import { formatDate } from '../lib/utils'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import toast from 'react-hot-toast'
import api from '@/lib/axios'

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id)); // Update the state to remove the deleted note without reloading the page
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <Link
      to={`/notes/${note._id}`}
    >
      <Card>
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{note.content}</p>
          <span className='text-sm text-base-content/60'>{formatDate(new Date(note.createdAt))}</span>
        </CardContent>
        <CardFooter>
          <div className='flex gap-2'>
            <PenSquareIcon className='size-4' />
            <button onClick={(e) => handleDelete(e, note._id)} className='btn btn-ghost btn-sm text-error'>
              <TrashIcon className='size-4' />
            </button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default NoteCard