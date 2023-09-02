import Layout from "@/components/layout";
import {useSelector} from 'react-redux';
import {bookData} from "@/components/Main/Books";

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
                        <div>Book title: {book.volumeInfo.title}</div>
                    ))}
                <div>
                    <span>TOTAL PRICE: $22.35</span>
                    <button>CHECKOUT</button>
                </div>
            </div>
        </Layout>
    )
}