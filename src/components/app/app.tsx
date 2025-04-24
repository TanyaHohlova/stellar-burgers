import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

import { useAppDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/ingredients/actions';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const navigate = useNavigate();

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='/profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal
                title=''
                onClose={() => {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title=''
                onClose={() => {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
export default App;

{
  /* <Route path='/' element={<ConstructorPage />} />
<Route path='/feed' element={<Feed />} />
<Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
<Route
  path='/register'
  element={<OnlyUnAuth component={<Register />} />}
/>
<Route path='/register' element={<Register />} />

<Route
  path='/forgot-password'
  element={<OnlyUnAuth component={<ForgotPassword />} />}
/>
<Route
  path='/reset-password'
  element={<OnlyUnAuth component={<ResetPassword />} />}
/>
<Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
<Route
  path='/profile/orders'
  element={<OnlyAuth component={<ProfileOrders />} />}
/>
<Route path='*' element={<NotFound404 />} /> */
}
