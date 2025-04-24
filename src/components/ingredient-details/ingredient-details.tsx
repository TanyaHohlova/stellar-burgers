import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { RootState, useAppSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();

  const ingredients = useAppSelector(
    (state: RootState) => state.combineSlices.ingredients
  );

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
