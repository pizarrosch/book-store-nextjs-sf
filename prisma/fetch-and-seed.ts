import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// Map frontend categories to Open Library subjects
const categoryToSubject: Record<string, string> = {
  'architecture': 'architecture',
  'art & fashion': 'art fashion',
  'biography': 'biography',
  'business': 'business',
  'drama': 'drama',
  'fiction': 'fiction',
  'food & drink': 'cooking food',
  'health & wellbeing': 'health wellness',
  'history & politics': 'history politics',
  'humor': 'humor comedy',
  'poetry': 'poetry',
  'psychology': 'psychology',
  'science': 'science',
  'technology': 'technology computers',
  'travel & maps': 'travel',
};

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  ratings_average?: number;
  ratings_count?: number;
  cover_i?: number;
  isbn?: string[];
  publisher?: string[];
  subject?: string[];
}

async function fetchBooksFromOpenLibrary(subject: string, limit: number = 20): Promise<OpenLibraryBook[]> {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?subject=${encodeURIComponent(subject)}&limit=${limit}&language=eng`
    );

    if (!response.ok) {
      console.error(`Failed to fetch ${subject}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error(`Error fetching ${subject}:`, error);
    return [];
  }
}

async function main() {
  console.log('🌍 Starting to fetch books from Open Library API...\n');

  // Clear existing books
  console.log('🗑️  Clearing existing books from database...');
  await prisma.book.deleteMany();
  console.log('✓ Database cleared\n');

  let totalBooks = 0;

  // Fetch books for each category
  for (const [category, subject] of Object.entries(categoryToSubject)) {
    console.log(`📚 Fetching ${category} books...`);

    const books = await fetchBooksFromOpenLibrary(subject, 25);

    if (books.length === 0) {
      console.log(`  ⚠️  No books found for ${category}`);
      continue;
    }

    let savedCount = 0;

    for (const book of books) {
      // Skip books without essential data
      if (!book.key || !book.title) continue;

      const bookId = book.key.replace('/works/', '');

      try {
        // Check if book already exists
        const existingBook = await prisma.book.findUnique({
          where: { id: bookId }
        });

        if (existingBook) {
          continue;
        }

        // Generate a random price between $9.99 and $49.99
        const price = parseFloat((Math.random() * 40 + 9.99).toFixed(2));

        // Create the book
        await prisma.book.create({
          data: {
            id: bookId,
            title: book.title,
            authors: book.author_name ? book.author_name.join(', ') : 'Unknown',
            description: book.subject ? book.subject.slice(0, 3).join(', ') : '',
            averageRating: book.ratings_average || null,
            ratingsCount: book.ratings_count || null,
            thumbnailUrl: book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : null,
            price: price,
            category: category.toLowerCase(),
          }
        });

        savedCount++;
      } catch (error) {
        // Skip duplicate or invalid books
        continue;
      }
    }

    totalBooks += savedCount;
    console.log(`  ✓ Saved ${savedCount} ${category} books\n`);

    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Seed completed! Total books saved: ${totalBooks}`);
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
