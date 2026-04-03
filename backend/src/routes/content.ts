import { Router, Request, Response } from 'express';
import SiteContent from '../models/SiteContent';

const router = Router();

// Deeply sanitize body to remove immutable Mongoose fields
const sanitize = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const newObj = { ...obj };
  delete newObj._id;
  delete newObj.__v;
  delete newObj.createdAt;
  delete newObj.updatedAt;

  for (const key in newObj) {
    newObj[key] = sanitize(newObj[key]);
  }
  return newObj;
};

// Get the current site content
router.get('/', async (req: Request, res: Response) => {
  try {
    // Disable all caching to prevent stale data
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    let content = await SiteContent.findOne().lean();
    if (!content) {
      return res.status(200).json(null);
    }
    res.json(content);
  } catch (error) {
    console.error('Error fetching site content:', error);
    res.status(500).json({ error: 'Failed to fetch site content' });
  }
});

// Update or initial create of site content
router.post('/', async (req: Request, res: Response) => {
  try {
    const updateData = sanitize(req.body);
    
    console.log('[Content API] Saving content update...');
    console.log('[Content API] Keys being saved:', Object.keys(updateData));

    // Use findOneAndUpdate with upsert for atomic operation
    // This is MORE RELIABLE than find + set + save
    const result = await SiteContent.findOneAndUpdate(
      {}, // find the single document
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      {
        new: true, // return the updated document
        upsert: true, // create if doesn't exist
        runValidators: false, // skip validation for flexibility
        lean: true // return plain object, not Mongoose document
      }
    );

    console.log('[Content API] ✅ Content saved successfully');
    
    // Log key fields for debugging
    if (result?.contactInfo) {
      console.log('[Content API] Saved contactInfo.address:', result.contactInfo.address);
    }
    if (result?.hero) {
      console.log('[Content API] Saved hero.name:', result.hero.name);
    }
    if (result?.about) {
      console.log('[Content API] Saved about.image:', result.about.image?.substring(0, 50));
    }

    return res.json(result);
  } catch (error) {
    console.error('Error saving site content:', error);
    res.status(500).json({ error: `Save failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
});

export default router;
