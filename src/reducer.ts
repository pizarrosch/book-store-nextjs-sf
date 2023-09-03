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
    },
    // extraReducers: {
    //     [HYDRATE]: (state, action) => {
    //         return {
    //             ...state,
    //             ...action.payload.name
    //         }
    //     }
    // }
})

export const priceSlice = createSlice({
    name: 'price',
    initialState: 0,
    reducers: {
        addPrice: (state: number, action: PayloadAction<number>) => {
            return state + action.payload;
        }
    }
})
export const {addBook} = bookSlice.actions;
export const {addPrice} = priceSlice.actions;
export default bookSlice.reducer;