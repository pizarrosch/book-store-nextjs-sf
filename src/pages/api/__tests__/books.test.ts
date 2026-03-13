import {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '@/lib/prisma';
import handler from '../books';

// Mock the prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn()
    }
  }
}));

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

describe('Books API', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      query: {
        category: 'Architecture',
        maxResults: '2',
        page: '1'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Reset mocks
    jest.clearAllMocks();

    // Default fetch mock
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({docs: []})
    });
  });

  it('should return 400 if category is missing', async () => {
    const reqWithoutCategory = {
      query: {
        maxResults: '10'
      }
    };

    await handler(reqWithoutCategory as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required parameter: category'
    });
  });

  it('should return books from database with pagination info', async () => {
    const mockBooks = [
      {
        id: '1',
        title: 'Test Book 1',
        authors: 'Author 1',
        description: 'Description 1',
        averageRating: 4.5,
        ratingsCount: 100,
        thumbnailUrl: 'https://example.com/image1.jpg',
        price: 9.99,
        category: 'architecture',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    (prisma.book.count as jest.Mock).mockResolvedValue(10);
    (prisma.book.findMany as jest.Mock).mockResolvedValue(mockBooks);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: {
        category: 'architecture'
      },
      skip: 0,
      take: 2
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      items: expect.any(Array),
      totalCount: 10,
      totalPages: 5,
      currentPage: 1
    });
  });

  it('should handle page 2 correctly', async () => {
    req.query = {
      category: 'Architecture',
      maxResults: '2',
      page: '2'
    };

    (prisma.book.count as jest.Mock).mockResolvedValue(10);
    (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

    // Mock fetch for page 2
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({docs: []})
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.book.findMany).toHaveBeenCalledWith({
      where: {
        category: 'architecture'
      },
      skip: 2,
      take: 2
    });
  });
});
