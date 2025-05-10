import { ingredientsReducer } from './ingredients/slice';
import { burgerConstructorReducer } from './burgerConstructor/slice';
import { serInfoReducer } from './user/slice';
import { orderCreateReducer } from './orderCreate/slice';
import { orderFeedReducer } from './orderFeed/slice';
import { profilieReducer } from './profile/slice';

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { expect } from '@jest/globals';

// Автоматически подключаем моки
jest.mock('@api');

const testReducer = combineReducers({
  combineSlices: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: serInfoReducer,
  orderCreate: orderCreateReducer,
  orderFeed: orderFeedReducer,
  profile: profilieReducer
});

describe('Проверка rootReducer', () => {
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние правильной структуры', () => {
    const initialState = testReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      combineSlices: expect.any(Object),
      burgerConstructor: expect.any(Object),
      user: expect.any(Object),
      orderCreate: expect.any(Object),
      orderFeed: expect.any(Object),
      profile: expect.any(Object)
    });
  });

  it('хранилище должно корректно инициализироваться', () => {
    const store = configureStore({
      reducer: testReducer
    });

    const state = store.getState();
    expect(state).toEqual(testReducer(undefined, { type: '@@INIT' }));
  });
});
