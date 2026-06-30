import { getCloudinary } from "../config/cloudinary.js";
import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ ...req.ownerFilter })
      .populate('userId', 'email') // Get the email column value from user table using Note's FK userId
      .sort({ created_at: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error occured while fetching notes", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    // const note = new Note({ title, content, ...req.ownerFilter });

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    // Create note object with no image first
    const note = new Note({
      title,
      content,
      ...req.ownerFilter, // foreign key
    });

    // Check if there's file uploaded, if true, send to cloudinary
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const cloudinary = getCloudinary();
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'notes',
        // Use a unique ID that doesn't depend on note._id
        public_id: `note_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
      });

      note.image = result.secure_url;
    }

    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("An error occured while creating note.", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({ _id: req.params.id, ...req.ownerFilter }); // Fetch single note from authenticated user
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("An error occured while fetching note.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    // Find the note to update
    const note = await Note.findOne({ _id: req.params.id, ...req.ownerFilter });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Update fileds
    note.title = title;
    note.content = content;

    // If a new image is uploaded, upload and replace
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const cloudinary = getCloudinary();
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'notes',
        public_id: `note_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
      });

      note.image = result.secure_url;
    }

    // Save everything
    await note.save();

    res.status(200).json({ message: 'Note updated successfully.', note });
  } catch (error) {
    console.error("An error occured while updating note.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteNote(req, res) {
  try {
    const deleteNote = await Note.findOneAndDelete({ _id: req.params.id, ...req.ownerFilter });

    if (!deleteNote) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("An error occured while deleting note", error);
    res.status(500).json({ message: "Internal server error." });
  }
}