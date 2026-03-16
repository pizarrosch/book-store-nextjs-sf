import {GetServerSideProps} from 'next';
import BookItem from '@/components/Book/BookItem';
import Layout from '@/components/Layout/Layout';
import {bookData} from '@/components/Book/Books';
import {prisma} from '@/lib/prisma';

type BookPageProps = {
  book: bookData;
};

export default function BookPage({book}: BookPageProps) {
  return (
    <Layout>
      <BookItem book={book} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const id = params?.id;

  if (typeof id !== 'string') return {notFound: true};

  const dbBook = await prisma.book.findUnique({where: {id}});

  if (!dbBook) return {notFound: true};

  const book: bookData = {
    id: dbBook.id as unknown as number,
    volumeInfo: {
      title: dbBook.title,
      authors: dbBook.authors.split(', '),
      description: dbBook.description || '',
      averageRating: dbBook.averageRating || 0,
      ratingsCount: dbBook.ratingsCount || 0,
      imageLinks: {thumbnail: dbBook.thumbnailUrl as string}
    },
    saleInfo: {
      listPrice: {amount: dbBook.price || 9.99}
    }
  };

  return {props: {book}};
};