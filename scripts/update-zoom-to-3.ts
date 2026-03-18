import {PrismaClient} from '../src/generated/prisma';

const prisma = new PrismaClient();

async function updateZoomTo3() {
  console.log('Updating all book cover URLs to zoom=3...');

  const books = await prisma.book.findMany({
    where: {
      thumbnailUrl: {
        not: null
      }
    }
  });

  console.log(`Found ${books.length} books with thumbnail URLs`);

  let updated = 0;

  for (const book of books) {
    if (book.thumbnailUrl) {
      const updatedUrl = book.thumbnailUrl.replace(/zoom=\d+/, 'zoom=3');

      if (updatedUrl !== book.thumbnailUrl) {
        await prisma.book.update({
          where: {id: book.id},
          data: {thumbnailUrl: updatedUrl}
        });
        updated++;
      }
    }
  }

  console.log(`✅ Updated ${updated} book cover URLs to zoom=3`);

  await prisma.$disconnect();
}

updateZoomTo3().catch((error) => {
  console.error('Error updating cover URLs:', error);
  process.exit(1);
});
