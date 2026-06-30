import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notesController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import attachOwnerFilter from "../middleware/attachOwnerFilter.js";
import { uploadNoteImage } from "../controllers/uploadController.js";
import { upload } from "../config/upload.js";

const router = express.Router();

// Every note route needs a logged-in user, and we want it to filter by user
router.use(authMiddleware, attachOwnerFilter);

router.get("/", getAllNotes);
router.post("/", upload.single('image'), createNote);
router.get("/:id", getNoteById);
router.put("/:id", upload.single('image'), updateNote);
router.delete("/:id", deleteNote);

router.post("/:id/upload", authMiddleware, attachOwnerFilter, upload.single('image'), uploadNoteImage);

export default router;