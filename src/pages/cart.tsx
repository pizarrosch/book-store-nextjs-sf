import Layout from "@/components/layout";

export default function Cart() {
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
                <div>
                    <span>TOTAL PRICE: $22.35</span>
                    <button>CHECKOUT</button>
                </div>
            </div>
        </Layout>
    )
}