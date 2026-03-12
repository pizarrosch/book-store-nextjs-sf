import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const sampleBooks = [
  {
    id: 'book-001',
    title: 'The Great Gatsby',
    authors: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    averageRating: 4.2,
    ratingsCount: 3500,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 12.99,
    category: 'Fiction',
  },
  {
    id: 'book-002',
    title: '1984',
    authors: 'George Orwell',
    description: 'A dystopian novel depicting a totalitarian society under constant surveillance.',
    averageRating: 4.5,
    ratingsCount: 5200,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 14.99,
    category: 'Fiction',
  },
  {
    id: 'book-003',
    title: 'To Kill a Mockingbird',
    authors: 'Harper Lee',
    description: 'A powerful story of racial injustice and childhood innocence in the American South.',
    averageRating: 4.6,
    ratingsCount: 4800,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 13.99,
    category: 'Fiction',
  },
  {
    id: 'book-004',
    title: 'The Pragmatic Programmer',
    authors: 'Andrew Hunt, David Thomas',
    description: 'A comprehensive guide to becoming a better software developer with practical advice and timeless wisdom.',
    averageRating: 4.3,
    ratingsCount: 2100,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 39.99,
    category: 'Technology',
  },
  {
    id: 'book-005',
    title: 'Clean Code',
    authors: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship teaching how to write code that is clean, maintainable, and testable.',
    averageRating: 4.4,
    ratingsCount: 3200,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 44.99,
    category: 'Technology',
  },
  {
    id: 'book-006',
    title: 'Sapiens',
    authors: 'Yuval Noah Harari',
    description: 'A brief history of humankind exploring how Homo sapiens came to dominate the world.',
    averageRating: 4.5,
    ratingsCount: 6700,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 18.99,
    category: 'History',
  },
  {
    id: 'book-007',
    title: 'Atomic Habits',
    authors: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones through tiny changes.',
    averageRating: 4.7,
    ratingsCount: 8900,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 16.99,
    category: 'Self-Help',
  },
  {
    id: 'book-008',
    title: 'The Art of War',
    authors: 'Sun Tzu',
    description: 'Ancient Chinese military treatise offering strategic wisdom applicable to business and life.',
    averageRating: 4.1,
    ratingsCount: 2800,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 9.99,
    category: 'Philosophy',
  },
  {
    id: 'book-009',
    title: 'Pride and Prejudice',
    authors: 'Jane Austen',
    description: 'A romantic novel of manners exploring themes of love, marriage, and social class in Regency England.',
    averageRating: 4.4,
    ratingsCount: 4200,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 11.99,
    category: 'Fiction',
  },
  {
    id: 'book-010',
    title: 'The Lean Startup',
    authors: 'Eric Ries',
    description: 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses.',
    averageRating: 4.2,
    ratingsCount: 3100,
    thumbnailUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    price: 21.99,
    category: 'Business',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing books (optional - remove if you want to keep existing data)
  console.log('🗑️  Clearing existing books...');
  await prisma.book.deleteMany();

  // Create books
  console.log('📚 Creating books...');
  for (const book of sampleBooks) {
    await prisma.book.create({
      data: book,
    });
    console.log(`  ✓ Created: ${book.title}`);
  }

  console.log(`\n✅ Seed completed! Created ${sampleBooks.length} books.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
