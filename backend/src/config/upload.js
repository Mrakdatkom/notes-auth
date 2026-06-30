import multer from 'multer';

// Store files in memory as Buffer — we'll pipe to Cloudinary
const storage = multer.memoryStorage();

// Accept only images (you can add more types later)
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
}

export const upload = multer({ storage, fileFilter });