import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {bookData} from "@/components/Main/Books";

export type TCartItem = {
    number: number,
    id: string
}

export type TCategory = {
    id: number,
    title: string,
}

type TUserCredentials = {
    email: string,
    name: string
}

const userCredentials = {
    email: '',
    name: ''
}

export type TClicked = {
    id: string,
    isClicked: 'buy now' | 'unavailable' | 'in the cart'
}
//
// const initialBuyButtonState = {
//     id
// }

export const bookSlice = createSlice({
    name: 'books',
    initialState: [] as bookData[],
    reducers: {
        addBook: (state: bookData[], action: PayloadAction<bookData>) => {
            state.push(action.payload)
        },
    }
})

export const priceSlice = createSlice({
    name: 'price',
    initialState: 0,
    reducers: {
        addPrice: (state: number, action: PayloadAction<number>) => {
            return state + action.payload;
        },
        subtractPrice: (state: number, action: PayloadAction<number>) => {
            return Math.abs(state - action.payload);
        }
    }
})

export const cartSlice = createSlice({
    name: 'cart',
    initialState: [] as TCartItem[],
    reducers: {
        addCartItem: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
            state.push({
                number: action.payload.number,
                id: action.payload.id
            })
        },
        removeCartItem: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
            let itemIndex = state.findIndex((item: TCartItem) => item.id === action.payload.id);
            state.splice(itemIndex, 1);
        },
        increase: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
            let itemIndex = state.find((item: TCartItem) => item.id === action.payload.id);
            itemIndex!.number += 1
        },
        decrease: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
            let itemIndex = state.find((item: TCartItem) => item.id === action.payload.id);
            itemIndex!.number -= 1
        },
    }
})

export const categorySlice = createSlice({
    name: 'category',
    initialState: {} as TCategory,
    reducers: {
        changeCategory: (state: TCategory, action: PayloadAction<TCategory>) => {
           return {
                id: action.payload.id,
                title: action.payload.title,
            };
        }
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState: userCredentials as TUserCredentials,
    reducers: {
        setEmail: (state: TUserCredentials, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setName: (state: TUserCredentials, action: PayloadAction<string>) => {
            state.name = action.payload;
        }
    }
})

export const clickedItemSlice = createSlice({
    name: 'clickedItem',
    initialState: [] as TClicked[],
    reducers: {
        isUnavailable: (state: TClicked[], action: PayloadAction<TClicked>) => {
            state.push({
                id: action.payload.id,
                isClicked: action.payload.isClicked
            })
        },
        addedToCart: (state: TClicked[], action: PayloadAction<TClicked>) => {
            state.push({
                id: action.payload.id,
                isClicked: action.payload.isClicked
            })
        },
        removedFromCart: (state: TClicked[], action: PayloadAction<TClicked>) => {
            state.push({
                id: action.payload.id,
                isClicked: action.payload.isClicked
            })

            const item = state.findIndex(chosenItem => chosenItem.id === action.payload.id && chosenItem.isClicked !== 'buy now');
            state.splice(item, 1);
        }
    }
})


export const {addBook} = bookSlice.actions;
export const {addPrice, subtractPrice} = priceSlice.actions;
export const {addCartItem, removeCartItem, increase, decrease} = cartSlice.actions;
export const {changeCategory} = categorySlice.actions;
export const {setEmail, setName} = userSlice.actions;
export const {isUnavailable, addedToCart, removedFromCart} = clickedItemSlice.actions;