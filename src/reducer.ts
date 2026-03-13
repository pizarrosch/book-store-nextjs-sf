import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {bookData} from '@/components/Book/Books';

export type TCartItem = {
  number: number;
  id: string;
};

export type TCategory = {
  id: number;
  title: string;
};

type TUserCredentials = {
  email: string;
  name: string;
  isAuthenticated: boolean;
  token: string | null;
  showLogin: boolean;
};

const userCredentialsInitialState = {
  email: '',
  name: '',
  isAuthenticated: false,
  token: null,
  showLogin: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userCredentialsInitialState as TUserCredentials,
  reducers: {
    setEmail: (state: TUserCredentials, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setName: (state: TUserCredentials, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setAuthenticated: (
      state: TUserCredentials,
      action: PayloadAction<boolean>
    ) => {
      state.isAuthenticated = action.payload;
    },
    setToken: (
      state: TUserCredentials,
      action: PayloadAction<string | null>
    ) => {
      state.token = action.payload;
    },
    setShowLogin: (state: TUserCredentials, action: PayloadAction<boolean>) => {
      state.showLogin = action.payload;
    },
    logout: (state: TUserCredentials) => {
      state.email = '';
      state.name = '';
      state.isAuthenticated = false;
      state.token = null;
    }
  }
});

export type TClicked = {
  id: string;
  isClicked: 'buy now' | 'unavailable' | 'in the cart';
};

export const bookSlice = createSlice({
  name: 'books',
  initialState: [] as bookData[],
  reducers: {
    addBook: (state: bookData[], action: PayloadAction<bookData>) => {
      state.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userSlice.actions.logout, () => []);
  }
});

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
  },
  extraReducers: (builder) => {
    builder.addCase(userSlice.actions.logout, () => 0);
  }
});

export const cartSlice = createSlice({
  name: 'cart',
  initialState: [] as TCartItem[],
  reducers: {
    addCartItem: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
      state.push({
        number: action.payload.number,
        id: action.payload.id
      });
    },
    removeCartItem: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
      const itemIndex = state.findIndex(
        (item: TCartItem) => item.id === action.payload.id
      );
      if (itemIndex !== -1) {
        state.splice(itemIndex, 1);
      }
    },
    increase: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
      const item = state.find(
        (item: TCartItem) => item.id === action.payload.id
      );
      if (item) {
        item.number += 1;
      }
    },
    decrease: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
      const item = state.find(
        (item: TCartItem) => item.id === action.payload.id
      );
      if (item) {
        item.number -= 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userSlice.actions.logout, () => []);
  }
});

export const categorySlice = createSlice({
  name: 'category',
  initialState: {} as TCategory,
  reducers: {
    changeCategory: (state: TCategory, action: PayloadAction<TCategory>) => {
      return {
        id: action.payload.id,
        title: action.payload.title
      };
    }
  }
});

export const clickedItemSlice = createSlice({
  name: 'clickedItem',
  initialState: [] as TClicked[],
  reducers: {
    isUnavailable: (state: TClicked[], action: PayloadAction<TClicked>) => {
      state.push({
        id: action.payload.id,
        isClicked: action.payload.isClicked
      });
    },
    addedToCart: (state: TClicked[], action: PayloadAction<TClicked>) => {
      state.push({
        id: action.payload.id,
        isClicked: action.payload.isClicked
      });
    },
    removedFromCart: (state: TClicked[], action: PayloadAction<TClicked>) => {
      state.push({
        id: action.payload.id,
        isClicked: action.payload.isClicked
      });

      const itemIndex = state.findIndex(
        (chosenItem) =>
          chosenItem.id === action.payload.id &&
          chosenItem.isClicked !== 'buy now'
      );
      if (itemIndex !== -1) {
        state.splice(itemIndex, 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userSlice.actions.logout, () => []);
  }
});

export const {addBook} = bookSlice.actions;
export const {addPrice, subtractPrice} = priceSlice.actions;
export const {addCartItem, removeCartItem, increase, decrease} =
  cartSlice.actions;
export const {changeCategory} = categorySlice.actions;
export const {
  setEmail,
  setName,
  setAuthenticated,
  setToken,
  setShowLogin,
  logout
} = userSlice.actions;
export const {isUnavailable, addedToCart, removedFromCart} =
  clickedItemSlice.actions;
