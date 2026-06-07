import googleServices from '../../android/app/google-services.json';

// We extract the Google Web Client ID dynamically from the google-services.json configuration to avoid hardcoding.
// In the google-services.json client array:
// - oauth_client with client_type = 3 represents the WEB client ID.
// - oauth_client with client_type = 1 represents the Android client ID.
const getGoogleWebClientId = (): string => {
  try {
    const clients = googleServices.client || [];
    for (const client of clients) {
      const oauthClients = client.oauth_client || [];
      for (const oauth of oauthClients) {
        if (oauth.client_type === 3) {
          return oauth.client_id;
        }
      }
    }
  } catch (error) {
    console.error('Failed to parse Google Web Client ID from google-services.json', error);
  }
  return '';
};

export const ENV = {
  GOOGLE_WEB_CLIENT_ID: getGoogleWebClientId(),

  // Vercel serverless API base URL (replace with your production URL after deploying Vercel backend)
  // E.g., 'https://ziuu-gas-backend.vercel.app'
  VERCEL_API_URL: 'https://ziuu-backend.vercel.app',

  // ImageKit.io Public Key (found in Developer Options on ImageKit console)
  IMAGEKIT_PUBLIC_KEY: 'public_l2kdgRYVNjMyMbB6zD46FuDV4Lo=',

  // ImageKit.io URL Endpoint (found in Developer Options on ImageKit console)
  // E.g., 'https://ik.imagekit.io/your_imagekit_id'
  IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/nyb0culss',
};
export default ENV;

