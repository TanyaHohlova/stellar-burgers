import { FC, memo, useEffect } from 'react';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { useAppDispatch } from '../../services/store';
import { newOrder } from '../../services/orderCreate/slice';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(newOrder(orderByDate[0].number));
  }, [orderByDate]);
  return <OrdersListUI orderByDate={orderByDate} />;
});
