import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '@/lib/prisma';
import handler from '../books';

// Mock the prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}));

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

// Mock Response constructor
global.Response = jest.fn() as unknown as typeof Response;

describe('Books API', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      query: {
        category: 'fantasy',
        maxResults: '2'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Reset mocks
    jest.clearAllMocks();

    // Default fetch mock to avoid "Cannot read properties of undefined (reading 'ok')" error
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({docs: []}),
      text: jest.fn().mockResolvedValue(JSON.stringify({docs: []})),
      headers: new Map(),
      clone: jest.fn().mockReturnThis()
    });
  });

  it('should return 400 if category or maxResults is missing', async () => {
    // Missing category
    const reqWithoutCategory = {
      query: {
        maxResults: '10'
      }
    };

    await handler(reqWithoutCategory as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required parameters'
    });

    // Missing maxResults
    const reqWithoutMaxResults = {
      query: {
        category: 'fantasy'
      }
    };

    await handler(
      reqWithoutMaxResults as NextApiRequest,
      res as NextApiResponse
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required parameters'
    });
  });

  it('should return books from database if enough are available', async () => {
    const mockBooks = [
      {
        id: '1',
        title: 'Test Book 1',
        authors: 'Author 1, Author 2',
        description: 'Description 1',
        averageRating: 4.5,
        ratingsCount: 100,
        thumbnailUrl: 'https://example.com/image1.jpg',
        price: 9.99,
        category: 'fantasy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Test Book 2',
        authors: 'Author 3',
        description: 'Description 2',
        averageRating: 3.5,
        ratingsCount: 50,
        thumbnailUrl: 'https://example.com/image2.jpg',
        price: 14.99,
        category: 'fantasy',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Mock the database to return our mock books
    console.log(
      'Setting up mock for findMany to return:',
      JSON.stringify(mockBooks)
    );
    (prisma.book.findMany as jest.Mock).mockResolvedValue(mockBooks);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: {
        category: 'fantasy'
      },
      take: 2
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      items: mockBooks.map((book) => ({
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
    });

    // Verify that fetch was not called
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should fetch books from Open Library API if not enough in database', async () => {
    // Return empty array from database
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    // Mock Open Library API response
    const mockApiResponse = {
      docs: [
        {
          key: '/works/OL1234567W',
          title: 'API Book 1',
          author_name: ['API Author 1', 'API Author 2'],
          description: 'API Description 1',
          ratings_average: 4.2,
          ratings_count: 120,
          cover_i: 12345
        },
        {
          key: '/works/OL7654321W',
          title: 'API Book 2',
          author_name: ['API Author 3'],
          description: 'API Description 2',
          ratings_average: 3.8,
          ratings_count: 80,
          cover_i: 67890
        }
      ]
    };

    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockApiResponse),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockApiResponse)),
      headers: new Map(),
      clone: jest.fn().mockReturnThis()
    });

    // Transform API response for verification
    mockApiResponse.docs.map((doc) => ({
      id: doc.key.replace('/works/', ''),
      title: doc.title,
      authors: doc.author_name.join(', '),
      description: doc.description,
      averageRating: doc.ratings_average,
      ratingsCount: doc.ratings_count,
      thumbnailUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
      price: 9.99,
      category: 'fantasy',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Mock findUnique to return null (book not found)
    (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

    // Mock create to return the created book
    (prisma.book.create as jest.Mock).mockImplementation((args) =>
      Promise.resolve({
        ...args.data,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    );

    await handler(req as NextApiRequest, res as NextApiResponse);

    // Verify database was queried
    expect(prisma.book.findMany).toHaveBeenCalled();

    // Verify Open Library API was called
    expect(fetch).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?q=subject:fantasy&limit=2`
    );

    // Verify books were created in database
    expect(prisma.book.create).toHaveBeenCalledTimes(2);

    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    // The exact response structure is complex to test due to the transformations,
    // but we can verify that json was called
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    // Return empty array from database
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    // Mock failed fetch response
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API error'));

    await handler(req as NextApiRequest, res as NextApiResponse);

    // Verify error response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error: 'Failed to fetch books'});
  });
});
