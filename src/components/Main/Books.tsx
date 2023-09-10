import s from './Books.module.scss';
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import noCoverBook from '../../../public/assets/no-cover.jpg';
import unfilledStar from '../../../public/assets/Star.svg';
import filledStar from '../../../public/assets/star-filled.svg';
import Image from "next/image";
import {addBook, addPrice, addCartItem, addedToCart, isUnavailable, TClicked} from "@/reducer";
import {useDispatch, useSelector} from "react-redux";
import {useAppSelector} from "@/pages/hooks";

const API_KEY: string = 'AIzaSyDNqOURIAkd6F9DFzmyw2L688i7-_tIlSo';

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

    const [books, setBooks] = useState<Array<bookData>>([]);

    function fetchBooks() {
        fetch(`https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=${API_KEY}&printType=books&startIndex=0&maxResults=${maxResults}&langRestrict=en`)
            .then(response => response.json())
            .then(data => setBooks(data.items));
    }

    function loadMoreBooks() {
        setMaxResults(prev => prev + 6)
        // setBooks(books)
    }

    useEffect(() => {
        fetchBooks();
    }, [category, maxResults]);

    function onBuyClick(e: React.MouseEvent) {
        const target = e.currentTarget as HTMLButtonElement;
        books.filter((item) => {
            const buyIndex = buyButtonState.find((buyItem: TClicked) => buyItem.id === String(item.id));
            if (String(target.dataset.id) === (item.id).toString()) {
                if (!item.saleInfo.listPrice && target.innerHTML !== 'unavailable') {
                    dispatch(isUnavailable({
                        id: String(target.dataset.id),
                        isClicked: "unavailable"
                    }));
                    return;
                } else if (target.innerHTML === 'unavailable') return;

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
                dispatch(addPrice(item.saleInfo.listPrice.amount));
            }
        })
    }


    return (
        <div className={s.booksContainer}>
            {books && books.map((book, id) => {
                const buyIndex = buyButtonState.find((item: TClicked) => item.id === String(book.id));
                return (<div className={s.book} data-index={book.id}>
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
                            buyIndex && buyIndex.isClicked === 'unavailable'
                                ? s.unavailable
                                : s.button}
                                onClick={onBuyClick}
                                data-id={book.id}
                        >
                            {buyIndex ? buyIndex.isClicked : 'Buy now'}
                        </button>
                    </div>
                </div>)
            })}
            <button className={s.button} onClick={loadMoreBooks}>LOAD MORE</button>
        </div>
    )
}

export default Books;