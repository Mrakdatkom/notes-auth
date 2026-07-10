import mongoose from "mongoose";
import { getCloudinary } from "../config/cloudinary.js";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    content: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// Create note logic
noteSchema.statics.createNewNote = async function (title, content, userId, image) {
  const note = new Note({ title, content, userId });

  if (image) {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${b64}`;

    const cloudinary = getCloudinary();
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'notes',
      // Use a unique ID that doesn't depend on note._id
      public_id: `note_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
    });

    note.image = result.secure_url;
  }
  return note;
}

// Update note logic
noteSchema.methods.updateNote = async function (title, content, image) {

  this.title = title.trim();
  this.content = content.trim();

  // If a new image is uploaded, upload and replace
  if (image) {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${b64}`;

    const cloudinary = getCloudinary();
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'notes',
      public_id: `note_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
    });

    this.image = result.secure_url;
  }

  await this.save();
  return this;
}

noteSchema.index({ userId: 1, createdAt: -1 }); // Index for efficient retrieval of notes by user and creation date

const Note = mongoose.model("Note", noteSchema);
export default Note;