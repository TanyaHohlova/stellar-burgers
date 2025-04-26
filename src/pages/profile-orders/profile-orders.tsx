import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { getUserOrders } from '../../services/profile/actions';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.profile.oredersUser);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
