import {NextApiResponse} from 'next';
import {isAuthenticated, NextApiRequestWithAuth} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import {bookData} from '@/components/Book/Books';
import {Book} from '@/generated/prisma';

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
  if (req.method !== 'POST') {
    return res.status(405).json({error: true, message: 'Method not allowed'});
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({error: true, message: 'Unauthorized'});
  }

  const userId = req.user!.id;
  const {bookIds} = req.body as {bookIds: string[]};

  if (Array.isArray(bookIds) && bookIds.length > 0) {
    const existingBooks = await prisma.book.findMany({
      where: {id: {in: bookIds.map(String)}}
    });
    const validIds = existingBooks.map((b) => b.id);

    await Promise.all(
      validIds.map((bookId) =>
        prisma.watchlistItem.upsert({
          where: {userId_bookId: {userId, bookId}},
          create: {userId, bookId},
          update: {}
        })
      )
    );
  }

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
