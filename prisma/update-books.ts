import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// Helper function to generate random rating between 1 and 5 with one decimal
function generateRandomRating(): number {
  return Math.round((Math.random() * 4 + 1) * 10) / 10; // 1.0 to 5.0
}

// Helper function to generate random ratings count
function generateRandomRatingsCount(): number {
  return Math.floor(Math.random() * 100000) + 100; // 100 to 100,099
}

async function main() {
  console.log('🔄 Starting books update...');

  // Fetch all existing books
  const books = await prisma.book.findMany();
  console.log(`📚 Found ${books.length} books to update`);

  // Update each book with random ratings
  let updated = 0;
  for (const book of books) {
    const randomRating = generateRandomRating();
    const randomRatingsCount = generateRandomRatingsCount();

    await prisma.book.update({
      where: { id: book.id },
      data: {
        averageRating: randomRating,
        ratingsCount: randomRatingsCount,
      },
    });

    console.log(`  ✓ Updated: ${book.title} - Rating: ${randomRating}, Count: ${randomRatingsCount}`);
    updated++;
  }

  console.log(`\n✅ Update completed! Updated ${updated} books.`);
}

main()
  .catch((e) => {
    console.error('❌ Update failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
