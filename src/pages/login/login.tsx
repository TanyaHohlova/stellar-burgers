import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { loginUser } from '../../services/user/actions';
import { useNavigate } from 'react-router-dom';
import { clearLoginError } from '../../services/user/slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = {
    email: email,
    password: password
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthChecked, user: userProfile } = useAppSelector(
    (state) => state.user
  );

  console.log(isAuthChecked);

  const error = useAppSelector((stat) => stat.user.errorLogin);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser(user));
  };

  useEffect(() => {
    if (isAuthChecked && userProfile) {
      navigate('/');
    }
  }, [isAuthChecked, userProfile]);

  useEffect(
    () => () => {
      dispatch(clearLoginError());
    },
    [dispatch]
  );

  return (
    <LoginUI
      errorText={error ? error : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
