import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';

// Secret key for JWT - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User data structure
export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // This will be hashed
};

// Mock database - in a real app, this would be a database
// For demo purposes, we'll use a hardcoded user with a hashed password
export const users: User[] = [
  {
    id: '1',
    name: 'Zaur Shomakhov',
    email: 'shomakhov@skillfactory.ru',
    // This is a hashed version of 'Zaurskillfactory'
    password: '$2b$12$th9YygP3xnMPRAcw9nqgKu8DvzIiSiHR4DFvas8YQwgPob/rpaJd2'
  }
];

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

// Function to verify a password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

// Function to find a user by email
export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Function to generate a JWT token
export function generateToken(user: { id: string; email: string; name: string }): string {
  // Create a token that expires in 1 hour
  return sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Function to verify a JWT token
export function verifyToken(token: string): { id: string; email: string; name: string } | null {
  try {
    return verify(token, JWT_SECRET) as { id: string; email: string; name: string };
  } catch (error) {
    return null;
  }
}

// Middleware to check if a request is authenticated
export function isAuthenticated(req: any): boolean {
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
