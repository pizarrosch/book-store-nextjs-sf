import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {bookData} from "@/components/Main/Books";

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
            return state - action.payload;
        }
    }
})

export type TCartItem = {
    number: number,
    id: string
}

const initialState: TCartItem = {
    number: 1,
    id: 'ZB_HDwAAQBAJ'
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: [initialState] as TCartItem[],
    reducers: {
        increase: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
            state.push({
                number: action.payload.number + 1,
                id: action.payload.id
            })
        },
        decrease: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
            state.push({
                number: action.payload.number - 1,
                id: action.payload.id
            })
        },
    }
})

export const categorySlice = createSlice({
    name: 'category',
    initialState: 'Architecture',
    reducers: {
        changeCategory: (state: string, action: PayloadAction<string>) => {
            return action.payload;
        }
    }
})

type TUserCredentials = {
    email: string,
    name: string
}

const userCredentials = {
    email: '',
    name: ''
}

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


export const {addBook} = bookSlice.actions;
export const {addPrice, subtractPrice} = priceSlice.actions;
export const {increase, decrease} = cartSlice.actions;
export const {changeCategory} = categorySlice.actions;
export const {setEmail, setName} = userSlice.actions;