// redux/WishListSlice.js
import { createSlice } from '@reduxjs/toolkit';

const WishListSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    addToWishList: (state, action) => {
      const itemExists = state.find(item => item.id === action.payload.id);
      if (!itemExists) {
        state.push(action.payload);
      }
    },
    removeFromWishList: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },
  },
});

export const { addToWishList, removeFromWishList } = WishListSlice.actions;
export default WishListSlice.reducer;
