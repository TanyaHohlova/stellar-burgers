import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurger } from './actions';
import { TNewOrderResponse } from '@api';

type TOrderCreateState = {
  orderInfo: TNewOrderResponse | null;
  orderRequest: boolean;
  numberNewOrder: number | null;
};

const initialState: TOrderCreateState = {
  orderInfo: null,
  orderRequest: false,
  numberNewOrder: null
};

export const orderCreateSlice = createSlice({
  name: 'orderCreate',
  initialState,
  reducers: {
    removeOrder: (state) => {
      state.orderInfo = null;
    },

    newOrder: (state, action: PayloadAction<number>) => {
      state.numberNewOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderInfo = null;
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderInfo = action.payload;
        state.orderRequest = false;
        state.numberNewOrder =
          action.payload?.order?.number ?? null
            ? action.payload.order.number
            : null;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderInfo = null;
        state.orderRequest = false;
      });
  },
  selectors: {
    getOrders: (state) => state
  }
});

export const { removeOrder, newOrder } = orderCreateSlice.actions;

export const orderCreateReducer = orderCreateSlice.reducer;
