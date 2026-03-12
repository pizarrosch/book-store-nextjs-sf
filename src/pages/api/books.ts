import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '@/lib/prisma';

// TypeScript interfaces
interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  description?: string;
  ratings_average?: number;
  ratings_count?: number;
  cover_i?: number;
  first_publish_year?: number;
}

interface FormattedBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    averageRating: number;
    ratingsCount: number;
    imageLinks: {
      thumbnail: string | null;
    };
  };
  saleInfo: {
    listPrice: {
      amount: number;
    };
  };
}

interface DBBook {
  id: string;
  title: string;
  authors: string;
  description: string | null;
  averageRating: number | null;
  ratingsCount: number | null;
  thumbnailUrl: string | null;
  price: number | null;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Valid book categories
const VALID_CATEGORIES = [
  'fiction',
  'science',
  'history',
  'biography',
  'fantasy',
  'mystery',
  'romance',
  'thriller',
  'horror',
  'science_fiction',
  'non-fiction',
  'poetry',
  'drama',
  'children',
  'young_adult',
  'classics'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {category, maxResults} = req.query;

  // Validate required parameters
  if (!category || !maxResults) {
    return res.status(400).json({error: 'Missing required parameters: category and maxResults'});
  }

  // Validate category is a string
  if (typeof category !== 'string') {
    return res.status(400).json({error: 'Category must be a string'});
  }

  // Validate category value (optional: can be removed if you want to allow any category)
  const categoryLower = category.toLowerCase();
  if (!VALID_CATEGORIES.includes(categoryLower)) {
    return res.status(400).json({
      error: `Invalid category. Valid categories: ${VALID_CATEGORIES.join(', ')}`
    });
  }

  // Validate maxResults is a valid number
  const maxResultsNum = Number(maxResults);
  if (isNaN(maxResultsNum) || maxResultsNum < 1 || maxResultsNum > 100) {
    return res.status(400).json({
      error: 'maxResults must be a number between 1 and 100'
    });
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
        category: categoryLower
      },
      take: maxResultsNum
    });

    console.log(
      'Books from database length:',
      dbBooks.length,
      'maxResults:',
      maxResultsNum
    );
    console.log('Condition check:', dbBooks.length >= maxResultsNum);

    // If we have enough books in the database, return them
    if (dbBooks.length >= maxResultsNum) {
      try {
        console.log('Books from database:', JSON.stringify(dbBooks));
        const formattedBooks = formatBooksForResponse(dbBooks);
        console.log('Formatted books:', JSON.stringify(formattedBooks));
        return res.status(200).json(formattedBooks);
      } catch (formatError) {
        console.error('Error formatting books from database:', formatError);
        return res
          .status(500)
          .json({error: 'Failed to format books from database'});
      }
    }

    // Otherwise, fetch from Open Library API
    const response = await fetch(
      `https://openlibrary.org/search.json?q=subject:${categoryLower}&limit=${maxResultsNum}`
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
      categoryLower
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
async function transformAndSaveBooks(books: OpenLibraryBook[], category: string): Promise<DBBook[]> {
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
function formatBooksForResponse(books: DBBook[]): {items: FormattedBook[]} {
  return {
    items: books.map((book) => ({
      id: book.id,
      volumeInfo: {
        title: book.title,
        authors: book.authors.split(', '),
        description: book.description || '',
        averageRating: book.averageRating || 0,
        ratingsCount: book.ratingsCount || 0,
        imageLinks: {
          thumbnail: book.thumbnailUrl
        }
      },
      saleInfo: {
        listPrice: {
          amount: book.price || 9.99
        }
      }
    }))
  };
}
