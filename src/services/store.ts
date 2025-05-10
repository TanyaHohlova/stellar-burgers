import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsReducer } from './ingredients/slice';
import { burgerConstructorReducer } from './burgerConstructor/slice';
import { serInfoReducer } from './user/slice';
import { orderCreateReducer } from './orderCreate/slice';
import { orderFeedReducer } from './orderFeed/slice';
import { profilieReducer } from './profile/slice';

const rootReducer = combineSlices({
  combineSlices: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: serInfoReducer,
  orderCreate: orderCreateReducer,
  orderFeed: orderFeedReducer,
  profile: profilieReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Создаем кастомный хук
export const useAppDispatch: () => AppDispatch = dispatchHook;
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
