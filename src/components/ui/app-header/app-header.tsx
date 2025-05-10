import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { getIconColor } from '@zlden/react-developer-burger-ui-components/dist/ui/icons/utils';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const isConstructorPage = location.pathname === '/';
  const isFeedPage = location.pathname === '/feed';

  const userPage = userName === undefined ? '/register' : '/profile';

  const isProfilePage = location.pathname === userPage;

  const styleIcon = {
    textDecoration: 'none'
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={isConstructorPage ? 'primary' : 'secondary'} />
            <Link style={styleIcon} to='/'>
              <p
                style={{
                  color: isConstructorPage
                    ? getIconColor('primary')
                    : getIconColor('secondary')
                }}
                className='text text_type_main-default ml-2 mr-10'
              >
                Конструктор
              </p>
            </Link>
          </>
          <>
            <ListIcon type={isFeedPage ? 'primary' : 'secondary'} />
            <Link style={styleIcon} to='/feed'>
              <p
                style={{
                  color: isFeedPage
                    ? getIconColor('primary')
                    : getIconColor('secondary')
                }}
                className='text text_type_main-default ml-2'
              >
                Лента заказов
              </p>
            </Link>
          </>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon type={isProfilePage ? 'primary' : 'secondary'} />
          <Link style={styleIcon} to={userPage}>
            <p
              style={{
                color: isProfilePage
                  ? getIconColor('primary')
                  : getIconColor('secondary')
              }}
              className='text text_type_main-default ml-2 '
            >
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
