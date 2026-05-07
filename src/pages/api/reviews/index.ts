import {NextApiResponse} from 'next';
import {isAuthenticated, NextApiRequestWithAuth} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

function formatReview(
  review: {
    id: string;
    bookId: string;
    userId: string;
    author: string;
    text: string;
    sentiment: string;
    createdAt: Date;
    votes: {userId: string; type: string}[];
  },
  requestUserId?: string
) {
  const upvotes = review.votes.filter((v) => v.type === 'up').length;
  const downvotes = review.votes.filter((v) => v.type === 'down').length;
  const userVote = requestUserId
    ? ((review.votes.find((v) => v.userId === requestUserId)?.type as
        | 'up'
        | 'down'
        | undefined) ?? null)
    : null;

  return {
    id: review.id,
    bookId: review.bookId,
    authorId: review.userId,
    author: review.author,
    text: review.text,
    sentiment: review.sentiment as 'positive' | 'negative' | 'neutral',
    createdAt: review.createdAt.toISOString(),
    upvotes,
    downvotes,
    userVote
  };
}

export default async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const {bookId} = req.query;
    if (!bookId || typeof bookId !== 'string') {
      return res.status(400).json({error: true, message: 'bookId is required'});
    }

    // Auth is optional for GET — used only to populate userVote
    isAuthenticated(req);
    const requestUserId = req.user?.id;

    const reviews = await prisma.review.findMany({
      where: {bookId},
      include: {votes: {select: {userId: true, type: true}}},
      orderBy: {createdAt: 'desc'}
    });

    return res.status(200).json({
      reviews: reviews.map((r) => formatReview(r, requestUserId))
    });
  }

  if (req.method === 'POST') {
    if (!isAuthenticated(req)) {
      return res.status(401).json({error: true, message: 'Unauthorized'});
    }

    const {bookId, text, sentiment} = req.body as {
      bookId: string;
      text: string;
      sentiment: string;
    };

    if (!bookId || !text?.trim() || !sentiment) {
      return res.status(400).json({
        error: true,
        message: 'bookId, text and sentiment are required'
      });
    }

    if (!['positive', 'negative', 'neutral'].includes(sentiment)) {
      return res.status(400).json({error: true, message: 'Invalid sentiment'});
    }

    const userId = req.user!.id;
    const author = req.user!.name;

    const existing = await prisma.review.findUnique({
      where: {userId_bookId: {userId, bookId}}
    });
    if (existing) {
      return res
        .status(409)
        .json({error: true, message: 'You have already reviewed this book'});
    }

    const review = await prisma.review.create({
      data: {userId, bookId, author, text: text.trim(), sentiment},
      include: {votes: {select: {userId: true, type: true}}}
    });

    return res.status(201).json({review: formatReview(review, userId)});
  }

  return res.status(405).json({error: true, message: 'Method not allowed'});
}
