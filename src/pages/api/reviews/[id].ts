import {NextApiResponse} from 'next';
import {isAuthenticated, NextApiRequestWithAuth} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({error: true, message: 'Method not allowed'});
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({error: true, message: 'Unauthorized'});
  }

  const {id} = req.query as {id: string};
  const userId = req.user!.id;

  const review = await prisma.review.findUnique({where: {id}});
  if (!review) {
    return res.status(404).json({error: true, message: 'Review not found'});
  }
  if (review.userId !== userId) {
    return res.status(403).json({error: true, message: 'Forbidden'});
  }

  await prisma.review.delete({where: {id}});
  return res.status(200).json({error: false});
}
