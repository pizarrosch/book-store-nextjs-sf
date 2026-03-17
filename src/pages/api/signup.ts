import {NextApiRequest, NextApiResponse} from 'next';
import {findUserByEmail, hashPassword, generateToken} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: true, message: 'Method not allowed'});
  }

  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({error: true, message: 'Name, email and password are required'});
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res
        .status(409)
        .json({error: true, message: 'Email already in use'});
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {name, email: email.toLowerCase(), password: hashedPassword}
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    return res
      .status(201)
      .json({error: false, name: user.name, email: user.email, token});
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({error: true, message: 'Signup failed'});
  }
}
