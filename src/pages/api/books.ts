import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '@/lib/prisma';

// TypeScript interfaces for Google Books API
interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
  saleInfo?: {
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
    retailPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
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
      customCover: string | null;
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
  customCoverUrl: string | null;
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

// Map frontend categories to Google Books API search terms
const categoryToGoogleBooksSubject: Record<string, string> = {
  architecture: 'architecture',
  'art & fashion': 'art+fashion',
  biography: 'biography',
  business: 'business',
  drama: 'drama',
  fiction: 'fiction',
  'food & drink': 'cooking',
  'health & wellbeing': 'health',
  'history & politics': 'history+politics',
  humor: 'humor',
  poetry: 'poetry',
  psychology: 'psychology',
  science: 'science',
  technology: 'technology',
  'travel & maps': 'travel'
};

interface FormattedBookResponse {
  items: FormattedBook[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FormattedBookResponse | {error: string}>
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
  const pageSize = Number(maxResults) || 10;
  const currentPage = Number(page) || 1;

  if (isNaN(pageSize) || pageSize < 1 || pageSize > 40) {
    return res.status(400).json({
      error: 'maxResults (pageSize) must be a number between 1 and 40'
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

    // Otherwise, fetch from Google Books API (fallback)
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          'Google Books API key not configured. Please add GOOGLE_BOOKS_API_KEY to your .env file.'
      });
    }

    const searchSubject =
      categoryToGoogleBooksSubject[categoryLower] || categoryLower;
    const startIndex = (currentPage - 1) * pageSize;

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${searchSubject}&maxResults=${pageSize}&startIndex=${startIndex}&key=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google Books API error:', errorData);
      throw new Error(
        `Google Books API responded with status: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(200).json({
        items: [],
        totalCount: 0,
        totalPages: 0,
        currentPage
      });
    }

    // Transform Google Books data to our format and save to database
    const transformedBooks = await transformAndSaveBooks(
      data.items,
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

// Transform Google Books data to our format and save to database
async function transformAndSaveBooks(
  volumes: GoogleBooksVolume[],
  category: string
): Promise<DBBook[]> {
  const transformedBooks = [];

  for (const volume of volumes) {
    // Skip volumes without id or title
    if (!volume.id || !volume.volumeInfo?.title) continue;

    const bookId = volume.id;

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

    // Get thumbnail URL and upgrade to HTTPS
    let thumbnailUrl =
      volume.volumeInfo.imageLinks?.thumbnail ||
      volume.volumeInfo.imageLinks?.smallThumbnail ||
      null;

    if (thumbnailUrl) {
      thumbnailUrl = thumbnailUrl
        .replace('http:', 'https:')
        .replace('&edge=curl', '')
        .replace(/zoom=\d+/, 'zoom=3');
    }

    // Get price from saleInfo
    const price =
      volume.saleInfo?.listPrice?.amount ||
      volume.saleInfo?.retailPrice?.amount ||
      9.99;

    // Create a new book record
    const newBook = await prisma.book.create({
      data: {
        id: bookId,
        title: volume.volumeInfo.title,
        authors: volume.volumeInfo.authors
          ? volume.volumeInfo.authors.join(', ')
          : 'Unknown',
        description: volume.volumeInfo.description || '',
        averageRating: volume.volumeInfo.averageRating || 0,
        ratingsCount: volume.volumeInfo.ratingsCount || 0,
        thumbnailUrl: thumbnailUrl,
        price: price,
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
          thumbnail: book.thumbnailUrl,
          customCover: book.customCoverUrl
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
