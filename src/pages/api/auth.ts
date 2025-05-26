import {NextApiRequest, NextApiResponse} from 'next';
import {findUserByEmail, verifyPassword, generateToken} from '@/lib/auth';

export type TUserCredentials = {
  error: boolean;
  name: string;
  email: string;
  token?: string;
};

export type TUserData = {
  userCredentials: TUserCredentials;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle login (POST request)
  if (req.method === 'POST') {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email and password are required'
      });
    }

    try {
      // Find user by email
      const user = findUserByEmail(email);

      // Check if user exists
      if (!user) {
        return res.status(401).json({
          error: true,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password);

      if (!isValid) {
        return res.status(401).json({
          error: true,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      });

      // Return user data and token
      return res.status(200).json({
        error: false,
        name: user.name,
        email: user.email,
        token
      });
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({
        error: true,
        message: 'Authentication failed'
      });
    }
  }
  // Handle user info (GET request)
  else if (req.method === 'GET') {
    // This endpoint should be protected, but for backward compatibility
    // we'll return minimal user info without sensitive data
    return res.status(200).json({
      error: false,
      name: 'Zaur Shomakhov',
      email: 'shomakhov@skillfactory.ru'
    });
  }
  // Handle other methods
  else {
    return res.status(405).json({
      error: true,
      message: 'Method not allowed'
    });
  }
}
