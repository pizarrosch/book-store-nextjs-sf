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

    // If we have enough books in the database, return them
    if (dbBooks.length >= Number(maxResults)) {
      try {
        console.log('Books from database:', JSON.stringify(dbBooks));
        const formattedBooks = formatBooksForResponse(dbBooks);
        console.log('Formatted books:', JSON.stringify(formattedBooks));
        return res.status(200).json(formattedBooks);
      } catch (formatError) {
        console.error('Error formatting books from database:', formatError);
        console.error('Error details:', formatError.stack);
        return res
          .status(500)
          .json({error: 'Failed to format books from database'});
      }
    }

    // Otherwise, fetch from Open Library API
    const response = await fetch(
      `https://openlibrary.org/search.json?q=subject:${category}&limit=${maxResults}`
    );

    if (!response.ok) {
      throw new Error(
        `Open Library API responded with status: ${response.status}`
      );
    }

    const data = await response.json();

    // Transform Open Library data to our format and save to database
    const transformedBooks = await transformAndSaveBooks(
      data.docs,
      String(category)
    );

    // Return the transformed books
    const formattedBooks = formatBooksForResponse(transformedBooks);
    return res.status(200).json(formattedBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({error: 'Failed to fetch books'});
  }
}

// Transform Open Library data to our format and save to database
async function transformAndSaveBooks(books: any[], category: string) {
  const transformedBooks = [];

  for (const book of books) {
    // Skip books without key or title
    if (!book.key || !book.title) continue;

    const bookId = book.key.replace('/works/', '');

    // Check if book already exists in database
    const existingBook = await prisma.book.findUnique({
      where: {
        id: bookId
      }
    });

    if (existingBook) {
      transformedBooks.push(existingBook);
      continue;
    }

    // Create a new book record
    const newBook = await prisma.book.create({
      data: {
        id: bookId,
        title: book.title,
        authors: book.author_name ? book.author_name.join(', ') : 'Unknown',
        description: book.description || '',
        averageRating: book.ratings_average || 0,
        ratingsCount: book.ratings_count || 0,
        thumbnailUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        price: 9.99, // Default price since Open Library doesn't provide pricing
        category: category
      }
    });

    transformedBooks.push(newBook);
  }

  return transformedBooks;
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
