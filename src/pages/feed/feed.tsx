import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getFeeds } from '../../services/orderFeed/actions';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const ordersInfo = useAppSelector((state) => state.orderFeed.orders);

  /** TODO: взять переменную из стора */
  const orders: TOrder[] = ordersInfo ? ordersInfo : [];

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
