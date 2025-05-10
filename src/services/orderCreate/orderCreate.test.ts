import { orderCreateReducer, orderCreateSlice } from './slice';
import { orderBurger } from './actions';
import type { TNewOrderResponse } from '@api';
import type { TOrder } from '../../utils/types';
import { expect, describe, it } from '@jest/globals';

const createTestOrder = (overrides: Partial<TOrder> = {}): TOrder => ({
  _id: '1',
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['ingredient1', 'ingredient2'],
  ...overrides
});

const createTestResponse = (
  orderOverrides?: Partial<TOrder>
): TNewOrderResponse => ({
  success: true,
  name: 'Флюоресцентный бургер',
  order: createTestOrder(orderOverrides)
});

describe('orderCreateSlice', () => {
  const initialState = {
    orderInfo: null,
    orderRequest: false,
    numberNewOrder: null
  };

  describe('initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(orderCreateReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('синхронные экшены', () => {
    it('removeOrder должен очищать orderInfo', () => {
      const state = orderCreateReducer(
        { ...initialState, orderInfo: createTestResponse() },
        orderCreateSlice.actions.removeOrder()
      );
      expect(state.orderInfo).toBeNull();
    });

    it('newOrder должен устанавливать numberNewOrder', () => {
      const state = orderCreateReducer(
        initialState,
        orderCreateSlice.actions.newOrder(54321)
      );
      expect(state.numberNewOrder).toBe(54321);
    });
  });

  describe('асинхронные экшены', () => {
    it('orderBurger.pending устанавливает флаг загрузки', () => {
      const state = orderCreateReducer(
        initialState,
        orderBurger.pending('', [])
      );
      expect(state.orderRequest).toBe(true);
    });

    it('orderBurger.fulfilled сохраняет данные заказа', () => {
      const response = createTestResponse();
      const state = orderCreateReducer(
        initialState,
        orderBurger.fulfilled(response, '', [])
      );

      expect(state.orderInfo).toEqual(response);
      expect(state.numberNewOrder).toBe(response.order.number);
      expect(state.orderRequest).toBe(false);
    });

    it('orderBurger.rejected сбрасывает состояние', () => {
      const state = orderCreateReducer(
        { ...initialState, orderRequest: true },
        orderBurger.rejected(new Error(), '', [])
      );
      expect(state).toEqual(initialState);
    });
  });

  describe('селекторы', () => {
    it('getOrders возвращает состояние', () => {
      const testState = {
        orderCreate: {
          ...initialState,
          orderInfo: createTestResponse(),
          numberNewOrder: 12345
        }
      };
      expect(orderCreateSlice.selectors.getOrders(testState)).toEqual(
        testState.orderCreate
      );
    });
  });

  describe('временные метки заказа', () => {
    it('проверяет сортировку по дате создания', () => {
      const orders = [
        createTestOrder({ createdAt: '2023-01-02T00:00:00.000Z' }),
        createTestOrder({ createdAt: '2023-01-01T00:00:00.000Z' })
      ];

      const sorted = [...orders].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      expect(sorted[0].createdAt).toBe('2023-01-01T00:00:00.000Z');
    });
  });
});
