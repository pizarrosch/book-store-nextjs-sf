import {PrismaClient} from '../src/generated/prisma';

const prisma = new PrismaClient();

/**
 * Script to add a custom cover URL to a specific book
 *
 * Usage:
 * 1. Place your cover image in /public/assets/book-covers/
 * 2. Run: npx ts-node scripts/add-custom-cover.ts <bookId> <imageFilename>
 *
 * Example:
 * npx ts-node scripts/add-custom-cover.ts "abc123" "my-book-cover.jpg"
 * This will set the customCoverUrl to: /assets/book-covers/my-book-cover.jpg
 */

async function addCustomCover(bookId: string, imageFilename: string) {
  try {
    // Check if book exists
    const book = await prisma.book.findUnique({
      where: {id: bookId}
    });

    if (!book) {
      console.error(`❌ Book with ID "${bookId}" not found`);
      process.exit(1);
    }

    // Update the book with custom cover URL
    const customCoverUrl = `/assets/book-covers/${imageFilename}`;

    await prisma.book.update({
      where: {id: bookId},
      data: {customCoverUrl}
    });

    console.log(`✅ Successfully added custom cover to book: "${book.title}"`);
    console.log(`   Cover URL: ${customCoverUrl}`);
    console.log(
      `\n📁 Make sure the image exists at: public${customCoverUrl}`
    );
  } catch (error) {
    console.error('Error adding custom cover:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const bookId = process.argv[2];
const imageFilename = process.argv[3];

if (!bookId || !imageFilename) {
  console.log('Usage: npx ts-node scripts/add-custom-cover.ts <bookId> <imageFilename>');
  console.log('\nExample:');
  console.log('  npx ts-node scripts/add-custom-cover.ts "abc123" "my-book-cover.jpg"');
  process.exit(1);
}

addCustomCover(bookId, imageFilename);
