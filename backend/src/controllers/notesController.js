export function getAllNotes(req, res) {
  res.status(200).json({ message: "Fetch all notes" });
}

export function createNote(req, res) {
  res.status(200).json({ message: "Create note" });
}

export function updateNote(req, res) {
  res.status(200).json({ message: `Note with id ${req.params.id} updated.` });
}

export function deleteNote(req, res) {
  res.status(200).json({ message: `Note with id ${req.params.id} deleted.` });
}