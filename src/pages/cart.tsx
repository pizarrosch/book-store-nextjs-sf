import Layout from "@/components/layout";
import {useSelector} from 'react-redux';
import {bookData} from "@/components/Main/Books";
import Image from "next/image";
import s from '../styles/cart.module.scss';
import filledStar from "../../public/assets/star-filled.svg";
import unfilledStar from "../../public/assets/Star.svg";
import minus from '../../public/assets/minus.svg';
import plus from '../../public/assets/plus.svg';
import {useState} from "react";

export default function Cart() {

    // @ts-ignore
    const books = useSelector((state) => state.books)
    const totalPrice = useSelector(state => state.price);

    return (
        <Layout>
            <div>
                <h1>Shopping cart</h1>
                <div className={s.subscript}>
                    <span>Item</span>
                    <div className={s.subscript_subitems}>
                        <span>Quantity</span>
                        <span>Price</span>
                        <span>Delivery</span>
                    </div>
                </div>
                <div className={s.itemsContainer}>
                    {books.map((book: bookData) => (
                        <div className={s.item}>
                            <div className={s.booksContainer}>
                                <Image src={book.volumeInfo.imageLinks.thumbnail} alt='book-cover' width={103} height={145}
                                       className={s.coverImage}/>
                                <div className={s.bookInformation}>
                                    <span className={s.title}>{book.volumeInfo.title}</span>
                                    <span className={s.author}>{book.volumeInfo.authors}</span>
                                    <div className={s.ratingsContainer}>
                                        <div className={s.rating}>
                                            <Image src={book.volumeInfo.averageRating > 0 ? filledStar : unfilledStar}
                                                   alt="rating"
                                                   width="12" height="12"/>
                                            <Image src={book.volumeInfo.averageRating > 1 ? filledStar : unfilledStar}
                                                   alt="rating"
                                                   width="12" height="12"/>
                                            <Image src={book.volumeInfo.averageRating > 2 ? filledStar : unfilledStar}
                                                   alt="rating"
                                                   width="12" height="12"/>
                                            <Image src={book.volumeInfo.averageRating > 3 ? filledStar : unfilledStar}
                                                   alt="rating"
                                                   width="12" height="12"/>
                                            <Image src={book.volumeInfo.averageRating > 4 ? filledStar : unfilledStar}
                                                   alt="rating"
                                                   width="12" height="12"/>
                                        </div>
                                        <span className={s.ratingAmount}>{
                                            book.volumeInfo.ratingsCount ?
                                                `${book.volumeInfo.ratingsCount} ${book.volumeInfo.ratingsCount === 1 ? 'review' : 'reviews'}` :
                                                'N/A'}
                            </span>
                                    </div>
                                </div>
                            </div>
                            <div className={s.itemAmountCounter}>
                                <Image src={minus} alt='' className={s.minus} />
                                <span className={s.itemsAmount}>1</span>
                                <Image src={plus} alt='' className={s.plus} />
                            </div>
                            <span className={s.itemPrice}>{book.saleInfo.listPrice ? `$${book.saleInfo.listPrice.amount}` : 'out of stock'}</span>
                            <span>Shipping: delivery</span>
                        </div>
                    ))}
                </div>
                <div>
                    <span>TOTAL PRICE: {totalPrice}</span>
                    <button>CHECKOUT</button>
                </div>
            </div>
        </Layout>
    )
}