import {PrismaClient} from '../src/generated/prisma';

const prisma = new PrismaClient();

async function clearBooks() {
  console.log('🗑️  Clearing all books from database...');

  try {
    const result = await prisma.book.deleteMany();
    console.log(`✅ Successfully deleted ${result.count} books`);
  } catch (error) {
    console.error('❌ Error clearing books:', error);
    process.exit(1);
  }
}

clearBooks()
  .catch((error) => {
    console.error('❌ Failed to clear books:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
