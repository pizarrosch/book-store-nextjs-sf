import '@/styles/globals.css';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import type {AppProps} from 'next/app';
import {Provider} from 'react-redux';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import {
  bookSlice,
  categorySlice,
  cartSlice,
  priceSlice,
  userSlice,
  clickedItemSlice,
  itemIsAddedSlice
} from '@/reducer';
import '@blueprintjs/core/lib/css/blueprint.css';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const reducer = combineReducers({
  books: bookSlice.reducer,
  price: priceSlice.reducer,
  cart: cartSlice.reducer,
  category: categorySlice.reducer,
  userCredentials: userSlice.reducer,
  clickedItem: clickedItemSlice.reducer,
  isItemAdded: itemIsAddedSlice.reducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // @ts-ignore
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});
const persistor = persistStore(store);

export default function App({Component, pageProps}: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
