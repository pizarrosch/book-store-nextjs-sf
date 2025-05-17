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
    saleInfo: TSaleInfo
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
    const [error, setError] = useState<string | null>(null);

    async function fetchBooks() {
        try {
            const headers: HeadersInit = {};

            // Add authorization header if user is authenticated
            if (userCredentials.isAuthenticated && userCredentials.token) {
                headers['Authorization'] = `Bearer ${userCredentials.token}`;
            }

            const response = await fetch(
                `/api/books?category=${encodeURIComponent(category)}&maxResults=${maxResults}`,
                {
                    headers
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setBooks(data.items || []);
            setError(null);
        } catch (error) {
            console.error('Error fetching books:', error);
            setError('Failed to fetch books. Please try again later.');
        }
    }

    function loadMoreBooks() {
        setMaxResults(prev => prev + 6)
        // setBooks(books)
    }

    useEffect(() => {
        fetchBooks();
    }, [category, maxResults, userCredentials.isAuthenticated, userCredentials.token]);

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
                // if (!item.saleInfo.listPrice && target.innerHTML !== 'unavailable') {
                //     dispatch(isUnavailable({
                //         id: String(target.dataset.id),
                //         isClicked: "unavailable"
                //     }));
                //     return;
                if (target.innerHTML === 'unavailable') return;

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
            {error && (
                <div style={{
                    padding: '20px',
                    margin: '20px 0',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '5px',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <p style={{ marginBottom: '15px' }}>{error}</p>
                    {error.includes('logged in') && (
                        <button 
                            className={s.button} 
                            onClick={() => document.querySelector('#user-icon')?.dispatchEvent(
                                new MouseEvent('click', { bubbles: true })
                            )}
                            style={{
                                display: 'inline-block',
                                margin: '0 auto'
                            }}
                        >
                            Log in
                        </button>
                    )}
                </div>
            )}
            {!error && books && books.map((book, id) => {
                const buyIndex = buyButtonState.find((item: TClicked) => item.id === String(book.id));
                return (<div className={s.book} data-index={book.id} key={id}>
                    <Image src={book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : noCoverBook}
                           alt="book-cover" className={s.bookCover} width={212} height={287}/>
                    <div className={s.book_bookInformation}>
                        <span className={s.author}>{book.volumeInfo.authors}</span>
                        <h2 className={s.title}>{book.volumeInfo.title}</h2>
                        <div className={s.ratingsWrapper}>
                            <div className={s.rating}>
                                <Image src={book.volumeInfo.averageRating > 0 ? filledStar : unfilledStar} alt="rating"
                                       width="12" height="12"/>
                                <Image src={book.volumeInfo.averageRating > 1 ? filledStar : unfilledStar} alt="rating"
                                       width="12" height="12"/>
                                <Image src={book.volumeInfo.averageRating > 2 ? filledStar : unfilledStar} alt="rating"
                                       width="12" height="12"/>
                                <Image src={book.volumeInfo.averageRating > 3 ? filledStar : unfilledStar} alt="rating"
                                       width="12" height="12"/>
                                <Image src={book.volumeInfo.averageRating > 4 ? filledStar : unfilledStar} alt="rating"
                                       width="12" height="12"/>
                            </div>
                            <span>{
                                book.volumeInfo.ratingsCount ?
                                    `${book.volumeInfo.ratingsCount} ${book.volumeInfo.ratingsCount === 1 ? 'review' : 'reviews'}` :
                                    'N/A'}
                            </span>
                        </div>
                        <p className={s.bookDescription}>{book.volumeInfo.description || 'No description available'}</p>
                        <span
                            className={s.price}>{book.saleInfo.listPrice ? '$' + book.saleInfo.listPrice.amount : 'out of stock'}</span>
                        <button className={
                            !book.saleInfo.listPrice
                                ? s.unavailable
                                : s.button}
                                onClick={onBuyClick}
                                data-id={book.id}
                        >
                            {!book.saleInfo.listPrice ? 'unavailable' : buyIndex ? buyIndex.isClicked : 'Buy now'}
                        </button>
                    </div>
                </div>)
            })}
            <button className={s.button} onClick={loadMoreBooks}>LOAD MORE</button>
        </div>
    )
}

export default Books;
