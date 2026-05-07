import {NextApiResponse} from 'next';
import {isAuthenticated, NextApiRequestWithAuth} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: true, message: 'Method not allowed'});
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({error: true, message: 'Unauthorized'});
  }

  const {id: reviewId} = req.query as {id: string};
  const {type} = req.body as {type: 'up' | 'down'};
  const userId = req.user!.id;

  if (!['up', 'down'].includes(type)) {
    return res
      .status(400)
      .json({error: true, message: 'type must be "up" or "down"'});
  }

  const review = await prisma.review.findUnique({where: {id: reviewId}});
  if (!review) {
    return res.status(404).json({error: true, message: 'Review not found'});
  }

  const existing = await prisma.reviewVote.findUnique({
    where: {reviewId_userId: {reviewId, userId}}
  });

  if (existing?.type === type) {
    // Same vote — remove it (toggle off)
    await prisma.reviewVote.delete({
      where: {reviewId_userId: {reviewId, userId}}
    });
  } else {
    // New vote or switching direction — upsert
    await prisma.reviewVote.upsert({
      where: {reviewId_userId: {reviewId, userId}},
      create: {reviewId, userId, type},
      update: {type}
    });
  }

  const votes = await prisma.reviewVote.findMany({where: {reviewId}});
  const userVote =
    (votes.find((v) => v.userId === userId)?.type as
      | 'up'
      | 'down'
      | undefined) ?? null;

  return res.status(200).json({
    upvotes: votes.filter((v) => v.type === 'up').length,
    downvotes: votes.filter((v) => v.type === 'down').length,
    userVote
  });
}
