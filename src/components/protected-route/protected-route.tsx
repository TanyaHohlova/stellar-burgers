import { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { getUser } from '../../services/user/slice';

type TProtectedProps = {
  onlyUnAuth?: boolean;
  component: JSX.Element;
};

const Protected = ({
  onlyUnAuth = false,
  component
}: TProtectedProps): JSX.Element => {
  const user = useAppSelector(getUser);
  const location = useLocation();

  if (!onlyUnAuth && !user) {
    // для авторизованного, но не авторизован
    return <Navigate to='/registr' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    // для неавторизованного, но авторизован
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // onlyUnAuth && !user для неавторизованного и не авторизован
  // !onlyUnAuth && user для авторизованного и авторизован

  return component;
};

export const OnlyAuth = Protected;
export const OnlyUnAuth = ({ component }: { component: JSX.Element }) => (
  <Protected onlyUnAuth component={component} />
);
