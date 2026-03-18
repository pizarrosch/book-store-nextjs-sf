import {PrismaClient} from '../src/generated/prisma';

const prisma = new PrismaClient();

// Map frontend categories to Google Books API search terms
const categoryToGoogleBooksSubject: Record<string, string> = {
  architecture: 'architecture',
  'art & fashion': 'art+fashion',
  biography: 'biography',
  business: 'business',
  drama: 'drama',
  fiction: 'fiction',
  'food & drink': 'cooking',
  'health & wellbeing': 'health',
  'history & politics': 'history+politics',
  humor: 'humor',
  poetry: 'poetry',
  psychology: 'psychology',
  science: 'science',
  technology: 'technology',
  'travel & maps': 'travel'
};

interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
  saleInfo?: {
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
    retailPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
}

async function fetchBooksFromGoogleBooks(
  subject: string,
  maxResults: number = 20,
  startIndex: number = 0
): Promise<GoogleBooksVolume[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_BOOKS_API_KEY not found in environment variables');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(subject)}&maxResults=${maxResults}&startIndex=${startIndex}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(
        `Google Books API responded with status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching books for subject "${subject}":`, error);
    return [];
  }
}

async function seedDatabase() {
  console.log('🌱 Starting to seed database with Google Books API data...\n');

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    console.error(
      '❌ GOOGLE_BOOKS_API_KEY not found. Please add it to your .env file.'
    );
    process.exit(1);
  }

  let totalBooksAdded = 0;

  for (const [category, subject] of Object.entries(
    categoryToGoogleBooksSubject
  )) {
    console.log(`📚 Fetching books for category: ${category}...`);

    try {
      // Fetch books in batches to get more results (3 batches of 40 = 120 books per category)
      const allBooks: GoogleBooksVolume[] = [];
      const batchSize = 40; // Google Books API max per request
      const numberOfBatches = 3; // Fetch 3 batches to get up to 120 books

      for (let batch = 0; batch < numberOfBatches; batch++) {
        const startIndex = batch * batchSize;
        const books = await fetchBooksFromGoogleBooks(subject, batchSize, startIndex);
        allBooks.push(...books);

        if (books.length < batchSize) {
          // No more books available
          break;
        }

        // Small delay between batches to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (allBooks.length === 0) {
        console.log(`  ⚠️  No books found for ${category}\n`);
        continue;
      }

      let addedCount = 0;

      for (const volume of allBooks) {
        // Skip volumes without id or title
        if (!volume.id || !volume.volumeInfo?.title) continue;

        const bookId = volume.id;

        // Check if book already exists
        const existingBook = await prisma.book.findUnique({
          where: {id: bookId}
        });

        if (existingBook) {
          continue;
        }

        // Get thumbnail URL and upgrade to HTTPS
        let thumbnailUrl =
          volume.volumeInfo.imageLinks?.thumbnail ||
          volume.volumeInfo.imageLinks?.smallThumbnail ||
          null;

        if (thumbnailUrl) {
          thumbnailUrl = thumbnailUrl
            .replace('http:', 'https:')
            .replace('&edge=curl', '')
            .replace('zoom=1', 'zoom=2');
        }

        // Get price from saleInfo
        const price =
          volume.saleInfo?.listPrice?.amount ||
          volume.saleInfo?.retailPrice?.amount ||
          9.99;

        // Create a new book record
        await prisma.book.create({
          data: {
            id: bookId,
            title: volume.volumeInfo.title,
            authors: volume.volumeInfo.authors
              ? volume.volumeInfo.authors.join(', ')
              : 'Unknown',
            description: volume.volumeInfo.description || '',
            averageRating: volume.volumeInfo.averageRating || 0,
            ratingsCount: volume.volumeInfo.ratingsCount || 0,
            thumbnailUrl: thumbnailUrl,
            price: price,
            category: category
          }
        });

        addedCount++;
      }

      totalBooksAdded += addedCount;
      console.log(`  ✅ Added ${addedCount} books to ${category}\n`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  ❌ Error processing category ${category}:`, error);
    }
  }

  console.log(`\n✨ Seeding completed!`);
  console.log(`📊 Total books added: ${totalBooksAdded}`);
}

seedDatabase()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
