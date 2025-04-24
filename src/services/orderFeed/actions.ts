import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getOrderByNumber = createAsyncThunk(
  'orderFeed/orderBurger',
  async (number: number) => getOrderByNumberApi(number)
);

export const getOrders = createAsyncThunk(
  'orderFeed/getOrders',
  async () => getOrdersApi() // конкретный пользователь
);

export const getFeeds = createAsyncThunk(
  'orderFeed/getFeeds',
  async () => getFeedsApi() // все
);
