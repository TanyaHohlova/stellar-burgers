import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from 'src/utils/types';
import { RootState } from '../store';
import { stat } from 'fs';

type TConstructorIngredient = TIngredient & { id: string };

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: Array<TConstructorIngredient>;
  ingredientsID: string[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  ingredientsID: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      }),

      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    removeIngredientAll: (state) => {
      state.ingredients = [];
      state.bun = null;
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;

      const ingredients = [...state.ingredients];
      const [movedIngredient] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedIngredient);

      state.ingredients = ingredients;
    }
  },

  selectors: {
    getBurgerConstructorState: (state) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  removeIngredientAll
} = burgerConstructorSlice.actions;

export const { getBurgerConstructorState } = burgerConstructorSlice.selectors;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
