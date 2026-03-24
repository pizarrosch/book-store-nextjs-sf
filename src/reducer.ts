import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {bookData} from '@/components/Book/Books';

export type TCartItem = {
  number: number;
  id: string;
  book: bookData;
};

export type TCategory = {
  id: number;
  title: string;
};

type TShippingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type TUserCredentials = {
  email: string;
  name: string;
  isAuthenticated: boolean;
  token: string | null;
  showLogin: boolean;
  id: string | null;
  bio: string;
  profilePicture: string | null;
  phone: string;
  shippingAddress: TShippingAddress | null;
  createdAt: string | null;
};

const userCredentialsInitialState = {
  email: '',
  name: '',
  isAuthenticated: false,
  token: null,
  showLogin: false,
  id: null,
  bio: '',
  profilePicture: null,
  phone: '',
  shippingAddress: null,
  createdAt: null
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
    updateProfile: (
      state: TUserCredentials,
      action: PayloadAction<Partial<TUserCredentials>>
    ) => {
      Object.assign(state, action.payload);
    },
    setProfilePicture: (
      state: TUserCredentials,
      action: PayloadAction<string>
    ) => {
      state.profilePicture = action.payload;
    },
    setBio: (state: TUserCredentials, action: PayloadAction<string>) => {
      state.bio = action.payload;
    },
    logout: (state: TUserCredentials) => {
      state.email = '';
      state.name = '';
      state.isAuthenticated = false;
      state.token = null;
      state.id = null;
      state.bio = '';
      state.profilePicture = null;
      state.phone = '';
      state.shippingAddress = null;
      state.createdAt = null;
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

export const cartSlice = createSlice({
  name: 'cart',
  initialState: [] as TCartItem[],
  reducers: {
    addCartItem: (state: TCartItem[], action: PayloadAction<TCartItem>) => {
      state.push({
        number: action.payload.number,
        id: action.payload.id,
        book: action.payload.book
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
    },
    clearCart: () => {
      return [];
    }
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
    builder.addCase(cartSlice.actions.clearCart, () => []);
  }
});

export const {addBook} = bookSlice.actions;
export const {addCartItem, removeCartItem, increase, decrease, clearCart} =
  cartSlice.actions;
export const {changeCategory} = categorySlice.actions;
export const {
  setEmail,
  setName,
  setAuthenticated,
  setToken,
  setShowLogin,
  updateProfile,
  setProfilePicture,
  setBio,
  logout
} = userSlice.actions;
export const {isUnavailable, addedToCart, removedFromCart} =
  clickedItemSlice.actions;

export type TWatchlistItem = {
  id: string;
  book: bookData;
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: [] as TWatchlistItem[],
  reducers: {
    addWatchlistItem: (
      state: TWatchlistItem[],
      action: PayloadAction<TWatchlistItem>
    ) => {
      const exists = state.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
      }
    },
    removeWatchlistItem: (
      state: TWatchlistItem[],
      action: PayloadAction<string>
    ) => {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    setWatchlist: (
      _state: TWatchlistItem[],
      action: PayloadAction<TWatchlistItem[]>
    ) => {
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userSlice.actions.logout, () => []);
  }
});

export const {addWatchlistItem, removeWatchlistItem, setWatchlist} =
  watchlistSlice.actions;

export type TCouponItem = {
  id: string;
  value: number;
  label: string;
  quantity: number;
};

export const couponSlice = createSlice({
  name: 'coupons',
  initialState: [] as TCouponItem[],
  reducers: {
    addCoupon: (state: TCouponItem[], action: PayloadAction<TCouponItem>) => {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({...action.payload, quantity: 1});
      }
    },
    removeCoupon: (state: TCouponItem[], action: PayloadAction<string>) => {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    increaseCoupon: (state: TCouponItem[], action: PayloadAction<string>) => {
      const item = state.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseCoupon: (state: TCouponItem[], action: PayloadAction<string>) => {
      const item = state.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity <= 1) {
          const index = state.findIndex((i) => i.id === action.payload);
          state.splice(index, 1);
        } else {
          item.quantity -= 1;
        }
      }
    },
    clearCoupons: () => {
      return [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userSlice.actions.logout, () => []);
    builder.addCase(cartSlice.actions.clearCart, () => []);
  }
});

export const {addCoupon, removeCoupon, increaseCoupon, decreaseCoupon, clearCoupons} =
  couponSlice.actions;
