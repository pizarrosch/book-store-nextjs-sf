import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if GOOGLE_BOOKS_API_KEY exists
  const hasKey = !!process.env.GOOGLE_BOOKS_API_KEY;
  const keyPrefix = process.env.GOOGLE_BOOKS_API_KEY
    ? process.env.GOOGLE_BOOKS_API_KEY.substring(0, 10) + '...'
    : 'NOT SET';

  // List all environment variable names (not values for security)
  const envVarNames = Object.keys(process.env).filter(
    (key) =>
      !key.includes('SECRET') &&
      !key.includes('PASSWORD') &&
      !key.includes('KEY') &&
      !key.includes('TOKEN')
  );

  return res.status(200).json({
    hasGoogleBooksApiKey: hasKey,
    googleBooksApiKeyPrefix: keyPrefix,
    allEnvVarNames: envVarNames,
    nodeEnv: process.env.NODE_ENV
  });
}
