import { ingredientsReducer, ingredientsSlice } from './slice';
import { fetchIngredients } from './actions';
import { TIngredient } from '../../utils/types';
import { expect, describe, it } from '@jest/globals';

// Моковые данные для тестов
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булочка',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 200,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

// Мок функции API
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('Редьюсер ingredientsSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Тест начального состояния
  it('должен возвращать корректное начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  // Тест pending состояния
  it('должен обрабатывать fetchIngredients.pending', () => {
    const state = ingredientsReducer(undefined, fetchIngredients.pending(''));
    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  // Тест fulfilled состояния
  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(mockIngredients, '')
    );
    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  // Тест rejected состояния
  it('должен обрабатывать fetchIngredients.rejected', () => {
    const errorMessage = 'Network Error';
    const action = {
      ...fetchIngredients.rejected(new Error(errorMessage), ''),
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(undefined, action);
    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: errorMessage
    });
  });

  // Тест селектора
  it('селектор getIngredients должен возвращать состояние', () => {
    const testState = {
      combineSlices: {
        // Добавляем обертку combineSlices
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      }
    };
    expect(ingredientsSlice.selectors.getIngredients(testState)).toEqual(
      testState.combineSlices
    );
  });
});
