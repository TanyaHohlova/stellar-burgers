import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

export const logout = createAsyncThunk('user/logout', async () => logoutApi());

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => loginUserApi(data)
);

export const setUser = createAction<TUser | null, 'user/setUser'>(
  'user/setUser'
);

export const getUserData = createAsyncThunk('user/getNewUser', async () =>
  getUserApi()
);

export type TExternalActions = ReturnType<typeof setUser>;
