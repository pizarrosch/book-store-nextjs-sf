import s from './Books.module.scss';
import {useEffect, useState} from "react";
import noCoverBook from '../../../public/assets/no-cover.jpg';
import unfilledStar from '../../../public/assets/Star.svg';
import filledStar from '../../../public/assets/star-filled.svg';
import Image from "next/image";

const API_KEY: string = 'AIzaSyDNqOURIAkd6F9DFzmyw2L688i7-_tIlSo';

type imageAddress = {
    thumbnail: string
}

type TListPrice = {
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

type bookData = {
    id: number,
    volumeInfo: volumeInfo,
    saleInfo: TSaleInfo
}

type TBookCategory = {
    category: string
}

function Books({category}: TBookCategory) {

    const [books, setBooks] = useState<Array<bookData>>([]);
    const [initialIndex, setInitialIndex] = useState(6);

    function fetchBooks() {
        fetch(`https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=${API_KEY}&printType=books&startIndex=${initialIndex}&maxResults=6&langRestrict=en`)
            .then(response => response.json())
            .then(data => setBooks(data.items));
    }

    function loadMoreBooks() {
        setInitialIndex(prev => prev + 6)
        fetchBooks();
    }

    useEffect(() => {
        fetchBooks();
    }, [category]);


    return (
        <div className={s.booksContainer}>
            { books && books.map(book => (
                    <div className={s.book} data-index={book.id}>
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
                        <button className={s.button}>Buy now</button>
                    </div>
                </div>
            ))}
            <button className={s.button} onClick={loadMoreBooks}>LOAD MORE</button>
        </div>
    )
}

export default Books;