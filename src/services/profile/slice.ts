import { createSlice } from '@reduxjs/toolkit';
import { getUserOrders, updateUser } from './actions';
import { TOrder } from '@utils-types';

type TProfileState = {
  updateUserRequest: boolean;
  updateUserFailed: boolean;
  updateUserError: string | null;
  oredersUser: Array<TOrder>;
};

const initialState: TProfileState = {
  updateUserRequest: false,
  updateUserFailed: false,
  updateUserError: null,
  oredersUser: []
};

export const profilieState = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state
  },
  extraReducers: (builder) => {
    builder
      // Обработка updateUser
      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserFailed = false;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUserRequest = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserFailed = true;
        state.updateUserError = (action.error.message ||
          'Произошла ошибка при обновлении профиля') as string;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.oredersUser = action.payload.orders;
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.oredersUser = [];
      });
  }
});

export const profilieReducer = profilieState.reducer;
