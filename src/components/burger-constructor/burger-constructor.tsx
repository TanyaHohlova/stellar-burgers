import { FC, useEffect, useMemo, useState } from 'react';
import { TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  getBurgerConstructorState,
  removeIngredientAll
} from '../../services/burgerConstructor/slice';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { orderBurger } from '../../services/orderCreate/actions';
import { getCookie } from '../../utils/cookie';
import { removeOrder } from '../../services/orderCreate/slice';

type TConstructorIngredient = TIngredient & { id: string };

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const [isOrderRequestModalOpen, setIsOrderRequestModalOpen] = useState(false);
  const [isOrdersDataModalOpen, setIsOrderDetailsModalOpen] =
    useState<TOrder | null>(null);

  const dispatch = useAppDispatch();
  const orderModalData = useAppSelector((state) =>
    state.orderCreate.orderInfo ? state.orderCreate.orderInfo.order : null
  );
  const orderRequest = useAppSelector(
    (state) => state.orderCreate.orderRequest
  );

  useEffect(() => {
    if (orderModalData) {
      dispatch(removeIngredientAll());
      setIsOrderDetailsModalOpen(orderModalData);
    }
    setIsOrderRequestModalOpen(orderRequest);
  }, [orderModalData, orderRequest]);

  //собираем заказ
  const constructorItems = useAppSelector(getBurgerConstructorState);
  const ingredientsOrder = constructorItems.ingredients.map((item) => item._id);
  const bunOrder = constructorItems.bun?._id;
  if (bunOrder) {
    ingredientsOrder.unshift(bunOrder, bunOrder); // Добавляем булку
  }

  const isAuthenticated = useMemo(() => !!getCookie('accessToken'), []);
  const onOrderClick = () => {
    if (isAuthenticated) {
      if (!constructorItems.bun || orderRequest) {
        return;
      }

      dispatch(orderBurger(ingredientsOrder));
    } else {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(removeOrder());
    setIsOrderDetailsModalOpen(null);
    setIsOrderRequestModalOpen(false);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isOrderRequestModalOpen}
      constructorItems={constructorItems}
      orderModalData={isOrdersDataModalOpen}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
