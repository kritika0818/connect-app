// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import WishListReducer from './WishlistSlice';

const store = configureStore({
  reducer: {
    wishlist: WishListReducer,
  },
});

export default store;
