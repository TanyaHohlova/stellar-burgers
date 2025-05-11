import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getFeeds } from '../../services/orderFeed/actions';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  /** TODO: взять переменные orderData и ingredients из стора */
  const ingredients = useAppSelector(
    (state) => state.combineSlices.ingredients
  );

  const orders = useAppSelector((state) => {
    const oreders = state.orderFeed.orders;
    if (oreders.length === 0) {
      return state.profile.oredersUser;
    }
    return oreders;
  });
  const order = orders.filter((item) => item.number === Number(number));
  const orderData = order[0];

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
