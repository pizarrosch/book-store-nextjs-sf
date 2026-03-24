import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {q} = req.query;

  if (!q || typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({error: 'Missing search query'});
  }

  const query = q.trim();

  try {
    const books = await prisma.book.findMany({
      where: {
        OR: [{title: {contains: query}}, {authors: {contains: query}}]
      },
      take: 6
    });

    const items = books.map((book) => ({
      id: book.id,
      volumeInfo: {
        title: book.title,
        authors: book.authors.split(', '),
        imageLinks: {
          thumbnail: book.thumbnailUrl,
          customCover: book.customCoverUrl
        }
      },
      saleInfo: {
        listPrice: {
          amount: book.price || 9.99
        }
      }
    }));

    return res.status(200).json({items});
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({error: 'Search failed'});
  }
}
