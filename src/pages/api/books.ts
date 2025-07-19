import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {category, maxResults} = req.query;

  if (!category || !maxResults) {
    return res.status(400).json({error: 'Missing required parameters'});
  }

  try {
    console.log(
      'API handler called with category:',
      category,
      'maxResults:',
      maxResults
    );

    // First, try to get books from our database
    const dbBooks = await prisma.book.findMany({
      where: {
        category: String(category)
      },
      take: Number(maxResults)
    });

    console.log(
      'Books from database length:',
      dbBooks.length,
      'maxResults:',
      Number(maxResults)
    );
    console.log('Condition check:', dbBooks.length >= Number(maxResults));

    // Always use books from the database, regardless of how many there are
    try {
      console.log('Books from database:', JSON.stringify(dbBooks));
      const formattedBooks = formatBooksForResponse(dbBooks);
      console.log('Formatted books:', JSON.stringify(formattedBooks));
      return res.status(200).json(formattedBooks);
    } catch (formatError) {
      console.error('Error formatting books from database:', formatError);
      if (formatError instanceof Error) {
        console.error('Error details:', formatError.stack);
      }
      return res
        .status(500)
        .json({error: 'Failed to format books from database'});
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({error: 'Failed to fetch books'});
  }
}

// Format books from database to match the expected response format
function formatBooksForResponse(books: any[]) {
  return {
    items: books.map((book) => ({
      id: book.id,
      volumeInfo: {
        title: book.title,
        authors: book.authors.split(', '),
        description: book.description,
        averageRating: book.averageRating,
        ratingsCount: book.ratingsCount,
        imageLinks: {
          thumbnail: book.thumbnailUrl
        }
      },
      saleInfo: {
        listPrice: {
          amount: book.price
        }
      }
    }))
  };
}
