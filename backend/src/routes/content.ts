import { Router, Request, Response } from 'express';
import SiteContent from '../models/SiteContent';

const router = Router();

// Get the current site content
router.get('/', async (req: Request, res: Response) => {
  try {
    let content = await SiteContent.findOne();
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
    let content = await SiteContent.findOne();
    
    // Deeply sanitize body to remove immutable fields
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

    const updateData = sanitize(req.body);

    if (content) {
      // Use set() for deep update 
      content.set(updateData);
      
      // Explicitly mark all provided top-level fields as modified
      Object.keys(updateData).forEach(field => {
        content.markModified(field);
      });
      
      content.updatedAt = new Date();
      await content.save();
    } else {
      content = new SiteContent(updateData);
      await content.save();
    }
    res.json(content);
  } catch (error) {
    console.error('Error saving site content:', error);
    res.status(500).json({ error: `Save failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
});

export default router;
