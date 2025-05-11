import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeeds, getOrderByNumber, getOrders } from './actions';

type TOrderFeed = {
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
};

const initialState: TOrderFeed = {
  orders: [],
  total: null,
  totalToday: null
};

export const orderFeedSlice = createSlice({
  name: 'orderFeed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  },
  selectors: {
    getOrders: (state) => state
  }
});

export const orderFeedReducer = orderFeedSlice.reducer;
