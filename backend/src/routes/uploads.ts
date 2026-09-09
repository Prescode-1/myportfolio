import express from 'express';
import multer from 'multer';
import Media from '../models/Media';

const router = express.Router();

// Memory storage for temporary buffer
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 4.5 * 1024 * 1024 }, // 4.5MB Vercel serverless function payload limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, png, gif, webp) are allowed!'));
  }
});

// Custom wrapper to handle Multer errors (like file size limit)
const uploadSingleImage = (req: any, res: any, next: any) => {
  upload.single('image')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image size exceeds 4.5MB serverless payload limit. Please upload a smaller image.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// @route   POST api/upload
// @desc    Upload an image to MongoDB and return its permanent URL
router.post('/', uploadSingleImage, async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    // Save to MongoDB
    const newMedia = new Media({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });

    const savedMedia = await newMedia.save();

    // Generate a permanent URL that points to our new GET route
    const fileUrl = `/api/upload/file/${savedMedia._id}`;
    
    res.json({ 
      url: fileUrl,
      id: savedMedia._id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// @route   GET api/upload/file/:id
// @desc    Serve an image from MongoDB
router.get('/file/:id', async (req: any, res: any) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', media.contentType);
    // Cache for 30 days to improve performance
    res.set('Cache-Control', 'public, max-age=2592000'); 
    res.send(media.data);
  } catch (error) {
    console.error('Serve error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

export default router;

