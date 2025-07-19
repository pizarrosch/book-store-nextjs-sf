import {PrismaClient} from '../src/generated/prisma';

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  console.log('Checking database for books...');

  // Count total books
  const totalBooks = await prisma.book.count();
  console.log(`Total books in database: ${totalBooks}`);

  // Count books by category
  const categories = await prisma.book.groupBy({
    by: ['category'],
    _count: {
      id: true
    }
  });

  console.log('Books by category:');
  categories.forEach(category => {
    console.log(`- ${category.category || 'No category'}: ${category._count.id}`);
  });

  // Get a sample book to check the data
  if (totalBooks > 0) {
    const sampleBook = await prisma.book.findFirst();
    console.log('Sample book:', sampleBook);
  }
}

// Run the script
main()
  .catch((e) => {
    console.error('Error checking database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });