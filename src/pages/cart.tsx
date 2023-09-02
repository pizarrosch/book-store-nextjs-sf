import Layout from "@/components/layout";
import {useSelector} from 'react-redux';
import {bookData} from "@/components/Main/Books";
import Image from "next/image";
import s from '../styles/cart.module.scss';

export default function Cart() {

    // @ts-ignore
    const books = useSelector((state) => state.books)

    return (
        <Layout>
            <div>
                <h1>Shopping cart</h1>
                <div>
                    <span>Item</span>
                    <span>Quantity</span>
                    <span>Price</span>
                    <span>Delivery</span>
                </div>
                {books.map((book: bookData) => (
                    <div className={s.booksContainer}>
                        <div>
                            <Image src={book.volumeInfo.imageLinks.thumbnail} alt='book-cover' width={103} height={145}/>
                            <div></div>
                        </div>
                    </div>
                    ))}
                <div>
                    <span>TOTAL PRICE: $22.35</span>
                    <button>CHECKOUT</button>
                </div>
            </div>
        </Layout>
    )
}