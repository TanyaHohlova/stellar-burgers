import { profilieReducer, profilieState } from './slice';
import { updateUser, getUserOrders } from './actions';
import type { TOrder } from '@utils-types';
import { TRegisterData, TUserResponse, TFeedsResponse } from '@api';
import { expect, describe, it } from '@jest/globals';

// Мокируем API
jest.mock('@api', () => ({
  updateUserApi: jest.fn().mockResolvedValue({ success: true, user: {} }),
  getOrdersApi: jest.fn().mockResolvedValue({ success: true, orders: [] })
}));

// Тестовые данные
const mockUserData: Partial<TRegisterData> = {
  name: 'Test User',
  email: 'test@example.com'
};

const mockUserResponse: TUserResponse = {
  success: true,
  user: {
    name: 'Updated User',
    email: 'updated@example.com'
  }
};

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Burger',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['ing1', 'ing2']
};

const mockFeedsResponse: TFeedsResponse = {
  success: true,
  orders: [mockOrder],
  total: 1,
  totalToday: 1
};

describe('profilieSlice reducer', () => {
  const initialState = {
    updateUserRequest: false,
    updateUserFailed: false,
    updateUserError: null,
    oredersUser: []
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(profilieReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('Экшен updateUser', () => {
    it('должен устанавливать флаг загрузки при pending', () => {
      const state = profilieReducer(
        initialState,
        updateUser.pending('', mockUserData)
      );
      expect(state.updateUserRequest).toBe(true);
      expect(state.updateUserFailed).toBe(false);
      expect(state.updateUserError).toBeNull();
    });

    it('должен сбрасывать флаги при успешном обновлении', () => {
      const state = profilieReducer(
        initialState,
        updateUser.fulfilled(mockUserResponse, '', mockUserData)
      );
      expect(state.updateUserRequest).toBe(false);
      expect(state.updateUserFailed).toBe(false);
    });

    it('должен сохранять ошибку при неудаче', () => {
      const error = new Error('Ошибка обновления');
      const state = profilieReducer(
        initialState,
        updateUser.rejected(error, '', mockUserData)
      );
      expect(state.updateUserFailed).toBe(true);
      expect(state.updateUserError).toBe('Ошибка обновления');
    });
  });

  describe('Экшен getUserOrders', () => {
    it('должен сохранять заказы пользователя при успешном запросе', () => {
      const state = profilieReducer(
        initialState,
        getUserOrders.fulfilled(mockFeedsResponse, '')
      );
      expect(state.oredersUser).toEqual([mockOrder]);
    });

    it('должен очищать заказы при ошибке запроса', () => {
      const stateWithOrders = {
        ...initialState,
        oredersUser: [mockOrder]
      };
      const state = profilieReducer(
        stateWithOrders,
        getUserOrders.rejected(new Error(), '')
      );
      expect(state.oredersUser).toEqual([]);
    });
  });

  describe('Селекторы', () => {
    it('getIngredients должен возвращать состояние', () => {
      const testState = {
        profile: {
          ...initialState,
          oredersUser: [mockOrder]
        }
      };
      const result = profilieState.selectors.getIngredients(testState);
      expect(result).toEqual(testState.profile);
    });
  });
});
