import {NextApiResponse} from 'next';
import {bookData} from '@/components/Book/Books';
import {Book} from '@/generated/prisma';
import {isAuthenticated, NextApiRequestWithAuth} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

function formatBook(book: Book): bookData {
  return {
    id: book.id as unknown as number,
    volumeInfo: {
      title: book.title,
      authors: book.authors.split(',').map((a) => a.trim()),
      description: book.description || '',
      averageRating: book.averageRating || 0,
      ratingsCount: book.ratingsCount || 0,
      imageLinks: {thumbnail: book.thumbnailUrl || ''}
    },
    saleInfo: {
      listPrice: {amount: book.price || 9.99}
    }
  };
}

export default async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({error: true, message: 'Unauthorized'});
  }

  const userId = req.user!.id;

  if (req.method === 'GET') {
    const items = await prisma.watchlistItem.findMany({
      where: {userId},
      include: {book: true},
      orderBy: {createdAt: 'desc'}
    });

    return res.status(200).json({
      items: items.map((item) => ({
        id: item.bookId,
        book: formatBook(item.book)
      }))
    });
  }

  if (req.method === 'POST') {
    const {bookId} = req.body;

    if (!bookId) {
      return res.status(400).json({error: true, message: 'bookId is required'});
    }

    const bookExists = await prisma.book.findUnique({
      where: {id: String(bookId)}
    });
    if (!bookExists) {
      return res.status(404).json({error: true, message: 'Book not found'});
    }

    await prisma.watchlistItem.upsert({
      where: {userId_bookId: {userId, bookId: String(bookId)}},
      create: {userId, bookId: String(bookId)},
      update: {}
    });

    return res.status(200).json({error: false});
  }

  if (req.method === 'DELETE') {
    const {bookId} = req.body;

    if (!bookId) {
      return res.status(400).json({error: true, message: 'bookId is required'});
    }

    await prisma.watchlistItem.deleteMany({
      where: {userId, bookId: String(bookId)}
    });

    return res.status(200).json({error: false});
  }

  return res.status(405).json({error: true, message: 'Method not allowed'});
}
