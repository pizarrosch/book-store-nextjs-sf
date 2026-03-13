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

// Valid book categories - matching frontend categories from CategoryDropdown.tsx
const VALID_CATEGORIES = [
  'architecture',
  'art & fashion',
  'biography',
  'business',
  'drama',
  'fiction',
  'food & drink',
  'health & wellbeing',
  'history & politics',
  'humor',
  'poetry',
  'psychology',
  'science',
  'technology',
  'travel & maps'
];

interface FormattedBookResponse {
  items: FormattedBook[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// ... existing code ...

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {category, maxResults, page} = req.query;

  // Validate required parameters
  if (!category) {
    return res
      .status(400)
      .json({error: 'Missing required parameter: category'});
  }

  // Validate category is a string
  if (typeof category !== 'string') {
    return res.status(400).json({error: 'Category must be a string'});
  }

  // Validate category value
  const categoryLower = category.toLowerCase();
  if (!VALID_CATEGORIES.includes(categoryLower)) {
    return res.status(400).json({
      error: `Invalid category. Valid categories: ${VALID_CATEGORIES.join(', ')}`
    });
  }

  // Pagination parameters
  const pageSize = Number(maxResults) || 6;
  const currentPage = Number(page) || 1;

  if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
    return res.status(400).json({
      error: 'maxResults (pageSize) must be a number between 1 and 100'
    });
  }

  if (isNaN(currentPage) || currentPage < 1) {
    return res.status(400).json({
      error: 'page must be a number greater than 0'
    });
  }

  try {
    const skip = (currentPage - 1) * pageSize;

    // Get total count for the category
    const totalCount = await prisma.book.count({
      where: {
        category: categoryLower
      }
    });

    // Try to get books from our database with pagination
    const dbBooks = await prisma.book.findMany({
      where: {
        category: categoryLower
      },
      skip: skip,
      take: pageSize
    });

    // If we have books in the database, return them (even if not a full page)
    if (dbBooks.length > 0) {
      const formattedBooks = formatBooksForResponse(dbBooks);
      return res.status(200).json({
        ...formattedBooks,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage
      });
    }

    // Otherwise, fetch from Open Library API (fallback)
    // For simplicity, we fetch maxResults from Open Library if DB is empty for this category
    const response = await fetch(
      `https://openlibrary.org/search.json?q=subject:${categoryLower}&limit=${pageSize}&page=${currentPage}`
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

    // Get updated total count after fetching from API
    const updatedTotalCount = await prisma.book.count({
      where: {
        category: categoryLower
      }
    });

    // Return the transformed books
    const formattedBooks = formatBooksForResponse(transformedBooks);
    return res.status(200).json({
      ...formattedBooks,
      totalCount: updatedTotalCount,
      totalPages: Math.ceil(updatedTotalCount / pageSize),
      currentPage
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({error: 'Failed to fetch books'});
  }
}

// Transform Open Library data to our format and save to database
async function transformAndSaveBooks(
  books: OpenLibraryBook[],
  category: string
): Promise<DBBook[]> {
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
