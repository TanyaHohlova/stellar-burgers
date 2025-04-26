import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserData,
  loginUser,
  logout,
  registerUser,
  setUser
} from './actions';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  errorRegister: string | null;
  errorLogin: string | null;
  isLoading: boolean;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  errorRegister: null,
  errorLogin: null,
  isLoading: true
};

export const userInfoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearLoginError: (stat) => {
      stat.errorLogin = null;
      stat.errorRegister = null;
    },
    clearUserInfo: (stat) => {
      stat.user = null;
    },
    setUserInfo: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(setUser, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.errorRegister = action.error.message ?? 'UnKnown error';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.errorLogin = action.error.message ?? 'UnKnown error';
      })
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isLoading = false;
      });
  }
});

export const { clearLoginError, clearUserInfo, setUserInfo } =
  userInfoSlice.actions;
export const { getUser, getIsAuthChecked } = userInfoSlice.selectors;

type ActionCreators = typeof userInfoSlice.actions;

export type TInternalActions = ReturnType<ActionCreators[keyof ActionCreators]>;

export const serInfoReducer = userInfoSlice.reducer;
