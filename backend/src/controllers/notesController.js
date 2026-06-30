import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ ...req.ownerFilter }).sort({ created_at: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error occured while fetching notes", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, ...req.ownerFilter });

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
    const updateNote = await Note.findOneAndUpdate(
      { _id: req.params.id, ...req.ownerFilter },
      { title, content },
      { new: true }
    );

    if (!updateNote) return res.status(404).json({ message: "Note not found." });

    res.status(200).json({ message: "Note updated successfully." });
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