import {NextApiResponse, NextApiRequest} from 'next';
import {hashPassword, generateToken, findUserByEmail} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: true,
      message: 'Method not allowed'
    });
  }

  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: true,
      message: 'Name, email and password are required'
    });
  }

  // Basic email validation
  if (!email.includes('@')) {
    return res.status(400).json({
      error: true,
      message: 'Invalid email address'
    });
  }

  // Password length validation
  if (password.length < 6) {
    return res.status(400).json({
      error: true,
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'A user with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      }
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    // Return user data and token
    return res.status(201).json({
      error: false,
      message: 'User created successfully',
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      error: true,
      message: 'An error occurred during signup'
    });
  }
}
