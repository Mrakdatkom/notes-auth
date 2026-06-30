import { getCloudinary } from "../config/cloudinary.js";
import Note from "../models/Note.js";

export async function uploadNoteImage(req, res) {
  try {
    // 1. Find the note (our ownerFilter middleware makes sure it's yours)
    const note = await Note.findOne({ _id: req.params.id, ...req.ownerFilter });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // 2. Upload the file buffer to Cloudinary
    const file = req.file;  // from multer
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // Convert buffer to base64 data URI — the format Cloudinary expects
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const cloudinary = getCloudinary();
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'notes',          // optional folder name
      public_id: `note_${note._id}_${Date.now()}`,
    });

    // 3. Save the secure URL on the note
    note.image = result.secure_url;
    await note.save();

    res.json({ message: 'Image uploaded', image: note.image });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ message: 'Upload failed' });
  }
}