import { getOrdersApi, TRegisterData, updateUserApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const updateUser = createAsyncThunk(
  'profilie/orderBurger',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const getUserOrders = createAsyncThunk('profilie/getOrders', async () =>
  getOrdersApi()
);
