import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({error: 'Invalid book ID'});
  }

  try {
    const book = await prisma.book.findUnique({where: {id}});

    if (!book) {
      return res.status(404).json({error: 'Book not found'});
    }

    return res.status(200).json({
      id: book.id,
      volumeInfo: {
        title: book.title,
        authors: book.authors.split(', '),
        description: book.description || '',
        averageRating: book.averageRating || 0,
        ratingsCount: book.ratingsCount || 0,
        imageLinks: {thumbnail: book.thumbnailUrl}
      },
      saleInfo: {
        listPrice: {amount: book.price || 9.99}
      }
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).json({error: 'Failed to fetch book'});
  }
}