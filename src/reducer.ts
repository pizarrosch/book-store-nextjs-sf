import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {bookData} from "@/components/Main/Books";
import {act} from "react-dom/test-utils";

const bookSlice = createSlice({
    name: 'books',
    initialState: [] as bookData[],
    reducers: {
        addBook: (state, action: PayloadAction<bookData>) => {
            state.push(action.payload);
        }
    }
})
export const {addBook} = bookSlice.actions;
export const store = configureStore({reducer: {books: bookSlice.reducer}});