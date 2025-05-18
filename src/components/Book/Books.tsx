import s from './Books.module.scss';
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import noCoverBook from '../../../public/assets/no-cover.jpg';
import unfilledStar from '../../../public/assets/Star.svg';
import filledStar from '../../../public/assets/star-filled.svg';
import Image from "next/image";
import {addBook, addPrice, addCartItem, addedToCart, isUnavailable, TClicked} from "@/reducer";
import {useDispatch} from "react-redux";
import {useAppSelector} from "@/pages/hooks";
import {useRouter} from "next/navigation";
import Backdrop from "@/components/Backdrop/Backdrop";
import CoverImage from "@/components/Book/CoverImage";
import BookDetails from "@/components/Book/BookDetails";

type imageAddress = {
    thumbnail: string
}

export type TListPrice = {
    amount: number
}

type TSaleInfo = {
    listPrice: TListPrice,
}

type volumeInfo = {
    imageLinks: imageAddress,
    authors: string[],
    title: string,
    averageRating: number,
    ratingsCount: number,
    description: string,
}

export type bookData = {
    id: number,
    volumeInfo: volumeInfo,
    saleInfo: TSaleInfo,
}

type TMaxResults = {
    maxResults: number,
    setMaxResults: Dispatch<SetStateAction<number>>
}

type TBookCategory = {
    category: string
} & TMaxResults

function Books({category, maxResults, setMaxResults}: TBookCategory) {

    const dispatch = useDispatch();
    const buyButtonState = useAppSelector(state => state.clickedItem);
    const userCredentials = useAppSelector(state => state.userCredentials);
    const router = useRouter();

    const [books, setBooks] = useState<Array<bookData>>([]);
    const [allBooks, setAllBooks] = useState<Array<bookData>>([]);
    const [error, setError] = useState<string | boolean>(false);

    async function fetchBooks() {
        try {
            const headers: HeadersInit = {};

            // Add authorization header if user is authenticated
            if (userCredentials.isAuthenticated && userCredentials.token) {
                headers['Authorization'] = `Bearer ${userCredentials.token}`;
            }

            // Fetch more books initially to ensure we have enough with prices
            const initialFetchCount = Math.max(30, maxResults * 5); // Fetch at least 30 books or 5x maxResults
            const response = await fetch(
                `/api/books?category=${encodeURIComponent(category)}&maxResults=${initialFetchCount}`,
                {
                    headers
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            const booksInStock = data.items.filter((book: bookData) =>
                book.saleInfo.listPrice &&
                book.saleInfo.listPrice.amount &&
                !isNaN(book.saleInfo.listPrice.amount) &&
                book.saleInfo.listPrice.amount > 0
            );
            setAllBooks(booksInStock || []);

            // If there are books with prices, display up to maxResults of them
            // Otherwise, set books to an empty array and show an error message
            if (booksInStock && booksInStock.length > 0) {
                setBooks(booksInStock.slice(0, maxResults));
                setError(false);
            } else {
                setBooks([]);
                setError(true);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            setError('Failed to fetch books. Please try again later.');
        }
    }

    function loadMoreBooks() {
        // Only increase maxResults if there are more books to load
        if (allBooks.length > maxResults) {
            setMaxResults(prev => prev + 6);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, [category, userCredentials.isAuthenticated, userCredentials.token]);

    useEffect(() => {
        if (allBooks.length > 0) {
            setBooks(allBooks.slice(0, maxResults));
        }
    }, [maxResults, allBooks]);

    function onBuyClick(e: React.MouseEvent) {
        // Check if user is authenticated
        if (!userCredentials.isAuthenticated || !userCredentials.token) {
            // Redirect to login page with current URL as redirect parameter
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        const target = e.currentTarget as HTMLButtonElement;
        books.filter((item) => {
            const buyIndex = buyButtonState.find((buyItem: TClicked) => buyItem.id === String(item.id));
            if (String(target.dataset.id) === (item.id).toString()) {
                if (target.innerHTML === 'in the cart') return;

                dispatch(addBook(item));
                dispatch(addCartItem({
                    number: 1,
                    id: String(item.id)
                }))
                dispatch(addedToCart({
                    id: String(item.id),
                    isClicked: "in the cart"
                }));
                item.saleInfo.listPrice && dispatch(addPrice(item.saleInfo.listPrice.amount));
            } else return;
        })
    }

    return (
        <div className={s.booksContainer}>
            {!error && books ?
                books.map((book: bookData, id) => {
                    const buyIndex = buyButtonState.find((item: TClicked) => item.id === String(book.id));
                    return (
                        <div className={s.book} data-index={book.id} key={id}>
                            <CoverImage {...book}/>
                            <BookDetails {...book} onClick={onBuyClick} buyIndex={buyIndex} />
                        </div>
                    )
                }) :
                <Backdrop/>
            }
            {allBooks.length > maxResults && (
                <button className={s.button} onClick={loadMoreBooks}>LOAD MORE</button>
            )}
        </div>
    )
}

export default Books;
