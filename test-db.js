const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const count = await prisma.book.count();
    console.log(`✅ Connected! Found ${count} books in database`);

    const sampleBooks = await prisma.book.findMany({
      take: 3,
      select: { id: true, title: true, category: true }
    });
    console.log('\nSample books:', sampleBooks);

    const byCategory = await prisma.book.groupBy({
      by: ['category'],
      _count: true
    });
    console.log('\nBooks by category:');
    byCategory.forEach(c => console.log(`  ${c.category}: ${c._count}`));

  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
