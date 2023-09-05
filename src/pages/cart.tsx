import Layout from "@/components/layout";
import {useDispatch, useSelector} from 'react-redux';
import {bookData} from "@/components/Main/Books";
import Image from "next/image";
import s from '../styles/cart.module.scss';
import filledStar from "../../public/assets/star-filled.svg";
import unfilledStar from "../../public/assets/Star.svg";
import minus from '../../public/assets/minus.svg';
import plus from '../../public/assets/plus.svg';
import {increase, decrease, addPrice, subtractPrice} from "@/reducer";
import {useEffect, useState} from "react";
import {act} from "react-dom/test-utils";

export default function Cart() {

    const [active, setActive] = useState(false);

    // @ts-ignore
    const books = useSelector((state) => state.books);
    const totalPrice = useSelector(state => state.price);
    const count = useSelector(state => state.counter);
    const dispatch = useDispatch();

    function increaseCount(e: MouseEvent) {
        const target = e.currentTarget as HTMLImageElement;
        books.filter((book: bookData) => {
            if (target.dataset.id === book.id) {
                setActive(true);
                 active && dispatch(increase(1))
                 dispatch(addPrice(book.saleInfo.listPrice && book.saleInfo.listPrice.amount))
            } else if (target.dataset.id !== book.id) {
                setActive(false)
            }
        })
    }

    function removeBookFromList(e: MouseEvent) {
        const target = e.target as HTMLDivElement;
        books.filter((book: bookData, id: number) => {
            if (count === 0 && target.dataset.id !== book.id) {
                return book;
            }
        })
    }

    function decreaseCount(e: MouseEvent) {
        const target = e.currentTarget as HTMLDivElement;
        books.forEach((book: bookData) => {
            if (target.dataset.id === book.id) {
                dispatch(decrease(1))
                dispatch(subtractPrice(book.saleInfo.listPrice && book.saleInfo.listPrice.amount))
            }
        })
    }

    return (
        <Layout>
            <div className={s.cartContainer}>
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
                        <div className={s.item} key={book.id}>
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
                            <div className={s.itemSubitems}>
                                <div className={s.itemAmountCounter} data-id={book.id}>
                                    <Image src={minus} alt='' className={s.minus} data-id={book.id} onClick={decreaseCount} />
                                    <span className={s.itemsAmount} data-id={book.id} onChange={removeBookFromList}>{count}</span>
                                    <Image src={plus} alt='' className={s.plus} data-id={book.id} onClick={increaseCount} />
                                </div>
                                <div className={s.itemPrice}>{book.saleInfo.listPrice ? `$${(book.saleInfo.listPrice.amount * count).toFixed(2)}` : 'out of stock'}</div>
                                <div>Shipping: delivery</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={s.priceContainer}>
                    <span className={s.totalPrice}>TOTAL PRICE: ${totalPrice.toFixed(2)}</span>
                    <button className={s.checkoutButton}>CHECKOUT</button>
                </div>
            </div>
        </Layout>
    )
}