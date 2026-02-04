import multer from "multer";
import path from "path";

// Memory storage
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/octet-stream" // 👈 fallback for Apidog
];

// Allowed file extensions
const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
  ".txt"
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  //console.log(ext)
  const mime = file.mimetype;
  //console.log(mime)

  const isMimeAllowed = allowedMimeTypes.includes(mime);
  const isExtAllowed = allowedExtensions.includes(ext);

  if (isMimeAllowed && isExtAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed: Images, PDF, DOC, DOCX, TXT"
      ),
      false
    );
  }
};

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB (comment was wrong before)
  },
  fileFilter
});

export default upload;
