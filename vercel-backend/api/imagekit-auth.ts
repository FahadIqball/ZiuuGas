import ImageKit from 'imagekit';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export default async (req: VercelRequest, res: VercelResponse) => {
  // Allow OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const authParameters = imagekit.getAuthenticationParameters();
    return res.status(200).json(authParameters);
  } catch (error: any) {
    console.error('ImageKit auth parameters generation failed:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate ImageKit authentication parameters' 
    });
  }
};
