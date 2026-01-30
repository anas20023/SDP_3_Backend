import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter (optional, but good practice per "Best Practices")
const fileFilter = (req, file, cb) => {
    // optimize for common document/image types
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // doc, docx
        'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: Images, PDF, DOC, DOCX, TXT'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});

export default upload;
