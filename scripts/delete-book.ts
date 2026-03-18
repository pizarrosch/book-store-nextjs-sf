import {PrismaClient} from '../src/generated/prisma';

const prisma = new PrismaClient();

/**
 * Script to delete a specific book by ID
 *
 * Usage:
 * npx tsx scripts/delete-book.ts <bookId>
 *
 * Example:
 * npx tsx scripts/delete-book.ts "abc123xyz"
 */

async function deleteBook(bookId: string) {
  try {
    // Check if book exists
    const book = await prisma.book.findUnique({
      where: {id: bookId}
    });

    if (!book) {
      console.error(`❌ Book with ID "${bookId}" not found`);
      process.exit(1);
    }

    console.log(`📖 Found book: "${book.title}" by ${book.authors}`);
    console.log(`🗑️  Deleting...`);

    // Delete the book (this will also delete related watchlist items due to cascade)
    await prisma.book.delete({
      where: {id: bookId}
    });

    console.log(`✅ Successfully deleted book: "${book.title}"`);
  } catch (error) {
    console.error('Error deleting book:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line argument
const bookId = process.argv[2];

if (!bookId) {
  console.log('Usage: npx tsx scripts/delete-book.ts <bookId>');
  console.log('\nExample:');
  console.log('  npx tsx scripts/delete-book.ts "abc123xyz"');
  process.exit(1);
}

deleteBook(bookId);
