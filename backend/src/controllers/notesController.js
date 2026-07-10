import Note from "../models/Note.js";

export async function getAllNotes(req, res, next) {
  try {
    const notes = await Note.find({ ...req.ownerFilter })
      .populate('userId', 'email') // Get the email column value from user table using Note's FK userId
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

export async function createNote(req, res, next) {
  try {
    const { title, content } = req.body;

    const userId = req.ownerFilter.userId;

    // Create note object with no image first
    const note = await Note.createNewNote(title, content, userId, req.file);

    const newNote = await note.save();
    res.status(201).json({ message: "Note created successfully", newNote });
  } catch (error) {
    next(error);
  }
}

export async function getNoteById(req, res, next) {
  try {
    const note = await Note.findOne({ _id: req.params.id, ...req.ownerFilter }); // Fetch single note from authenticated user
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
}

export async function updateNote(req, res, next) {
  try {
    const { title, content } = req.body;
    const id = req.params.id;
    const userId = req.ownerFilter.userId;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    const updatedNote = await note.updateNote(title, content, req.file);

    res.status(200).json({
      message: 'Note updated successfully.',
      note: {
        id: updatedNote._id,
        title: updatedNote.title,
        content: updatedNote.content,
        image: updatedNote.image,
        createdAt: updatedNote.createdAt,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const deleteNote = await Note.findOneAndDelete({ _id: req.params.id, ...req.ownerFilter });

    if (!deleteNote) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
}