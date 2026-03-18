import {PrismaClient} from '../src/generated/prisma';

const prisma = new PrismaClient();

/**
 * Script to find duplicate books with similar titles
 *
 * Usage:
 * npx tsx scripts/find-duplicates.ts
 */

// Normalize title for comparison (remove dots, extra spaces, convert to lowercase)
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\./g, '') // Remove dots
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

async function findDuplicates() {
  console.log('🔍 Finding duplicate books...\n');

  const books = await prisma.book.findMany({
    orderBy: {
      title: 'asc'
    }
  });

  const titleMap: Map<string, Array<{id: string; title: string; authors: string; thumbnailUrl: string | null; customCoverUrl: string | null}>> = new Map();

  // Group books by normalized title
  for (const book of books) {
    const normalized = normalizeTitle(book.title);
    const existing = titleMap.get(normalized) || [];
    existing.push({
      id: book.id,
      title: book.title,
      authors: book.authors,
      thumbnailUrl: book.thumbnailUrl,
      customCoverUrl: book.customCoverUrl
    });
    titleMap.set(normalized, existing);
  }

  // Find duplicates
  const duplicates = Array.from(titleMap.entries())
    .filter(([_, books]) => books.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!');
    await prisma.$disconnect();
    return;
  }

  console.log(`Found ${duplicates.length} sets of duplicate books:\n`);

  for (const [normalizedTitle, bookGroup] of duplicates) {
    console.log(`📚 Normalized title: "${normalizedTitle}"`);
    console.log(`   ${bookGroup.length} variations found:\n`);

    bookGroup.forEach((book, index) => {
      console.log(`   ${index + 1}. Title: "${book.title}"`);
      console.log(`      ID: ${book.id}`);
      console.log(`      Authors: ${book.authors}`);
      console.log(`      Google Cover: ${book.thumbnailUrl ? 'Yes' : 'No'}`);
      console.log(`      Custom Cover: ${book.customCoverUrl ? 'Yes ✨' : 'No'}`);
      console.log('');
    });

    console.log('   To delete a book, run:');
    console.log(`   npx tsx scripts/delete-book.ts <bookId>\n`);
    console.log('---\n');
  }

  await prisma.$disconnect();
}

findDuplicates().catch((error) => {
  console.error('Error finding duplicates:', error);
  process.exit(1);
});
