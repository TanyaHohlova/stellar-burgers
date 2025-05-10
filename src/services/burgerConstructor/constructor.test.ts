import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  removeIngredientAll
} from './slice';
import { TIngredient } from 'src/utils/types';
import { expect, describe, it } from '@jest/globals';

describe('Редьюсер burgerConstructorSlice', () => {
  // Моковые данные для тестов
  const mockBun: TIngredient = {
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
  };

  const mockMainIngredient: TIngredient = {
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
  };

  // Тест начального состояния
  describe('Начальное состояние', () => {
    it('должен возвращать корректное начальное состояние', () => {
      const initialState = burgerConstructorReducer(undefined, {
        type: 'unknown'
      });
      expect(initialState).toStrictEqual({
        bun: null,
        ingredients: [],
        ingredientsID: []
      });
    });
  });

  // Тесты для добавления ингредиентов
  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      const state = burgerConstructorReducer(undefined, addIngredient(mockBun));
      expect(state.bun).not.toBeNull();
      expect(state.bun?._id).toBe(mockBun._id);
      expect(state.ingredients.length).toBe(0);
    });

    it('должен добавлять начинку в конструктор', () => {
      const state = burgerConstructorReducer(
        undefined,
        addIngredient(mockMainIngredient)
      );
      expect(state.bun).toBeNull();
      expect(state.ingredients.length).toBe(1);
      expect(state.ingredients[0]._id).toBe(mockMainIngredient._id);
    });
  });

  // Тесты для удаления ингредиентов
  describe('Удаление ингредиентов', () => {
    it('должен удалять ингредиент из конструктора', () => {
      // Сначала добавляем ингредиент
      let state = burgerConstructorReducer(
        undefined,
        addIngredient(mockMainIngredient)
      );
      const ingredientId = state.ingredients[0].id;

      // Затем удаляем его
      state = burgerConstructorReducer(state, removeIngredient(ingredientId));
      expect(state.ingredients.length).toBe(0);
    });
  });

  // Тесты для перемещения ингредиентов
  describe('Перемещение ингредиентов', () => {
    it('должен перемещать ингредиенты в конструкторе', () => {
      // Создаем несколько ингредиентов
      const ingredients = [
        { ...mockMainIngredient, _id: '1' },
        { ...mockMainIngredient, _id: '2' },
        { ...mockMainIngredient, _id: '3' }
      ];

      // Добавляем их в конструктор
      let state = ingredients.reduce(
        (s, ing) => burgerConstructorReducer(s, addIngredient(ing)),
        burgerConstructorReducer(undefined, { type: 'init' })
      );

      // Запоминаем исходный порядок
      const originalOrder = state.ingredients.map((i) => i._id);

      // Перемещаем первый элемент на позицию 2
      state = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      // Проверяем новый порядок
      expect(state.ingredients[0]._id).toBe(originalOrder[1]);
      expect(state.ingredients[1]._id).toBe(originalOrder[2]);
      expect(state.ingredients[2]._id).toBe(originalOrder[0]);
    });
  });

  // Тесты для полной очистки
  describe('Очистка конструктора', () => {
    it('должен очищать весь конструктор', () => {
      // Добавляем булку и начинку
      let state = burgerConstructorReducer(undefined, addIngredient(mockBun));
      state = burgerConstructorReducer(
        state,
        addIngredient(mockMainIngredient)
      );

      // Очищаем конструктор
      state = burgerConstructorReducer(state, removeIngredientAll());

      // Проверяем что все очистилось
      expect(state.bun).toBeNull();
      expect(state.ingredients.length).toBe(0);
    });
  });
});
