import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {bookData} from "@/components/Main/Books";
import {HYDRATE} from "next-redux-wrapper";
import {act} from "react-dom/test-utils";

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

export const counterSlice = createSlice({
    name: 'counter',
    initialState: 1,
    reducers: {
        increase: (state: number, action: PayloadAction<number>) => {
            return state + action.payload;
        },
        decrease: (state: number, action: PayloadAction<number>) => {
            return state - action.payload;
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
    password: string
}

const userCredentials = {
    email: '',
    password: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState: userCredentials as TUserCredentials,
    reducers: {
        setEmail: (state: TUserCredentials, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setPassword: (state: TUserCredentials, action: PayloadAction<string>) => {
             state.password = action.payload;
        }
    }})


export const {addBook} = bookSlice.actions;
export const {addPrice, subtractPrice} = priceSlice.actions;
export const {increase, decrease} = counterSlice.actions;
export const {changeCategory} = categorySlice.actions;
export const {setEmail, setPassword} = userSlice.actions;