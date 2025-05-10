import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { updateUser } from '../../services/profile/actions';
import { getUserData } from '../../services/user/actions';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const name = useAppSelector((satte) => satte.user.user?.name);
  const email = useAppSelector((state) => state.user.user?.email);

  const errorUpdateUser = useAppSelector(
    (state) => state.profile.updateUserError
  );
  const [errorValue, setErrorValue] = useState(errorUpdateUser);

  useEffect(() => {
    setErrorValue(errorUpdateUser);
  }, [errorUpdateUser]);

  const user = useMemo(
    () => ({
      name: name ? name : '',
      email: email ? email : ''
    }),
    [name, email]
  );

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue)).then(() => {
      dispatch(getUserData());
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    setErrorValue('');
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={errorValue || ''}
    />
  );
};
