import Link from 'next/link';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useDispatch} from 'react-redux';
import Backdrop from '@/components/Backdrop/Backdrop';
import BookDetails from '@/components/Book/BookDetails';
import CoverImage from '@/components/Book/CoverImage';
import Pagination from '@/components/Pagination/Pagination';
import {useAppSelector} from '@/pages/hooks';
import {addBook, addCartItem, TClicked} from '@/reducer';
import s from './Books.module.scss';

type imageAddress = {
  thumbnail: string;
  customCover?: string;
};

export type TListPrice = {
  amount: number;
};

type TSaleInfo = {
  listPrice: TListPrice;
};

type volumeInfo = {
  imageLinks: imageAddress;
  authors: string[];
  title: string;
  averageRating: number;
  ratingsCount: number;
  description: string;
};

export type bookData = {
  id: number;
  volumeInfo: volumeInfo;
  saleInfo: TSaleInfo;
};

type TPageInfo = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setTotalPages: (_total: number) => void;
};

type TBookCategory = {
  category: string;
} & TPageInfo;

const PAGE_SIZE = 6;

function Books({category, page, setPage, setTotalPages}: TBookCategory) {
  const dispatch = useDispatch();

  const buyButtonState = useAppSelector((state) => state.clickedItem);
  const userCredentials = useAppSelector((state) => state.userCredentials);
  const cart = useAppSelector((state) => state.cart);

  const [books, setBooks] = useState<Array<bookData>>([]);
  const [localTotalPages, setLocalTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};

      if (userCredentials.isAuthenticated && userCredentials.token) {
        headers['Authorization'] = `Bearer ${userCredentials.token}`;
      }

      const response = await fetch(
        `/api/books?category=${encodeURIComponent(category)}&maxResults=${PAGE_SIZE}&page=${page}`,
        {
          headers
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data.items || []);
      const total = data.totalPages || 0;
      setLocalTotalPages(total);
      setTotalPages(total);
      setError(!data.items || data.items.length === 0);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [
    category,
    page,
    userCredentials.isAuthenticated,
    userCredentials.token,
    setTotalPages
  ]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  function onBuyClick(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLButtonElement;
    const bookId = target.dataset.id;

    // Find the book that was clicked
    const selectedBook = books.find((item) => String(item.id) === bookId);

    if (!selectedBook) return;

    // Check if the book is already in cart using cart state
    const isInCart = cart.some((item) => item.id === String(selectedBook.id));

    // If already in cart, return early
    if (isInCart) return;

    // Add book to cart
    dispatch(addBook(selectedBook));
    dispatch(
      addCartItem({
        number: 1,
        id: String(selectedBook.id),
        book: selectedBook
      })
    );
  }

  return (
    <div className={s.booksContainer}>
      {isLoading ? (
        <Backdrop type="loading" />
      ) : error ? (
        <Backdrop type="empty" />
      ) : (
        <>
          <div className={s.booksGrid}>
            {books.map((book: bookData, id) => {
              const buyIndex = buyButtonState.find(
                (item: TClicked) => item.id === String(book.id)
              );
              return (
                <div className={s.book} data-index={book.id} key={id}>
                  <Link href={`/books/${book.id}`}>
                    <CoverImage {...book} />
                    <BookDetails
                      {...book}
                      onClick={onBuyClick}
                      buyIndex={buyIndex}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className={s.bottomPagination}>
            <Pagination
              currentPage={page}
              totalPages={localTotalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Books;
