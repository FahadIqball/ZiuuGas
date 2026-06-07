import admin from 'firebase-admin';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Firebase Admin SDK using Service Account credentials from environment variables
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Correctly handle service account key newline escaping in environment configurations
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // Allow OPTIONS preflight request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { recipientId, title, body, data } = req.body;

  if (!recipientId || !title || !body) {
    return res.status(400).json({ 
      error: 'Missing required parameters: recipientId, title, and body are required' 
    });
  }

  try {
    // 1. Look up recipient's fcmToken in Firestore 'users' collection
    const userDoc = await admin.firestore().collection('users').doc(recipientId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: `User with ID ${recipientId} not found` });
    }

    const userData = userDoc.data();
    const fcmToken = userData?.fcmToken;

    if (!fcmToken) {
      return res.status(404).json({ 
        error: `FCM Token not registered for user ${recipientId}` 
      });
    }

    // 2. Dispatch FCM Message using FCM HTTP v1 protocol
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);
    return res.status(200).json({ success: true, messageId: response });
  } catch (error: any) {
    console.error('Push notification dispatch failed:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to dispatch push notification' 
    });
  }
};
