import {hash, compare} from 'bcryptjs';
import {sign, verify} from 'jsonwebtoken';
import {NextApiRequest} from 'next';
import {prisma} from './prisma';

// Secret key for JWT - MUST be set in environment variables
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = process.env.JWT_SECRET;

// User data structure
export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // This will be hashed
  profilePicture?: string | null;
  bio?: string | null;
  phone?: string | null;
  addressStreet?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressPostal?: string | null;
  addressCountry?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

// Function to verify a password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

// Function to find a user by email from database
export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {email: email.toLowerCase()}
  });
  return user;
}

// Function to generate a JWT token
export function generateToken(user: {
  id: string;
  email: string;
  name: string;
}): string {
  // Create a token that expires in 7 days
  return sign({id: user.id, email: user.email, name: user.name}, JWT_SECRET, {
    expiresIn: '7d'
  });
}

// Function to verify a JWT token
export function verifyToken(
  token: string
): {id: string; email: string; name: string} | null {
  try {
    return verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
    };
  } catch (error) {
    return null;
  }
}

// Extended NextApiRequest with user property
export interface NextApiRequestWithAuth extends NextApiRequest {
  user?: {id: string; email: string; name: string};
}

// Middleware to check if a request is authenticated
export function isAuthenticated(req: NextApiRequestWithAuth): boolean {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return false;
  }

  // Add the user to the request object
  req.user = payload;
  return true;
}
