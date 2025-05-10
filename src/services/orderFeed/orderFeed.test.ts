import { orderFeedReducer, orderFeedSlice } from './slice';
import { getOrders, getFeeds } from './actions';
import { TFeedsResponse } from '@api';
import { TOrder } from 'src/utils/types';
import { expect, describe, it } from '@jest/globals';

// Мокируем API
jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  getFeedsApi: jest.fn()
}));

// Тестовые данные
const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['ingredient1', 'ingredient2']
};

const mockFeedResponse: TFeedsResponse = {
  success: true,
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('orderFeedSlice reducer', () => {
  const initialState = {
    orders: [],
    total: null,
    totalToday: null
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(orderFeedReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('экшен getOrders', () => {
    it('должен сохранять заказы при успешном выполнении', () => {
      const action = getOrders.fulfilled(mockFeedResponse, '');
      const state = orderFeedReducer(initialState, action);

      expect(state.orders).toEqual(mockFeedResponse.orders);
      expect(state.total).toBe(mockFeedResponse.total);
      expect(state.totalToday).toBe(mockFeedResponse.totalToday);
    });
  });

  describe('экшен getFeeds', () => {
    it('должен сохранять ленту заказов при успешном выполнении', () => {
      const action = getFeeds.fulfilled(mockFeedResponse, '');
      const state = orderFeedReducer(initialState, action);

      expect(state.orders).toEqual(mockFeedResponse.orders);
      expect(state.total).toBe(mockFeedResponse.total);
      expect(state.totalToday).toBe(mockFeedResponse.totalToday);
    });

    it('должен перезаписывать предыдущие заказы', () => {
      const prevState = {
        orders: [{ ...mockOrder, number: 999 }],
        total: 50,
        totalToday: 5
      };
      const action = getFeeds.fulfilled(mockFeedResponse, '');
      const state = orderFeedReducer(prevState, action);

      expect(state.orders).not.toContainEqual(prevState.orders[0]);
      expect(state.orders).toEqual(mockFeedResponse.orders);
    });
  });

  it('селектор getOrders должен возвращать состояние', () => {
    const testState = {
      orderFeed: {
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      }
    };
    const result = orderFeedSlice.selectors.getOrders(testState);
    expect(result).toEqual(testState.orderFeed);
  });
});
