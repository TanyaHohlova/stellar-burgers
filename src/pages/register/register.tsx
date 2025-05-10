import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { registerUser } from '../../services/user/actions';
import { clearLoginError } from '../../services/user/slice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = {
    email: email,
    name: userName,
    password: password
  };

  const error = useAppSelector((stat) => stat.user.errorRegister);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser(user));
  };

  useEffect(
    () => () => {
      dispatch(clearLoginError());
    },
    [dispatch]
  );
  return (
    <RegisterUI
      errorText={error ? error : ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
