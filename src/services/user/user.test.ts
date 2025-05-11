import { userInfoSlice, initialState } from './slice';
import {
  registerUser,
  loginUser,
  logout,
  getUserData,
  setUser
} from './actions';
import { TUser } from '@utils-types';
import { expect, describe, it, afterEach } from '@jest/globals';

// Мокируем API
jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  registerUserApi: jest.fn()
}));

// Тестовые данные
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

// Полный мок ответа API в соответствии с TAuthResponse
const mockAuthResponse = {
  success: true,
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token'
};

describe('userInfoSlice reducer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    expect(userInfoSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('экшен setUser', () => {
    it('должен устанавливать пользователя', () => {
      const action = setUser(mockUser);
      const state = userInfoSlice.reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
    });

    it('должен очищать пользователя при null', () => {
      const action = setUser(null);
      const state = userInfoSlice.reducer(initialState, action);
      expect(state.user).toBeNull();
    });
  });

  describe('экшен registerUser', () => {
    it('должен сохранять пользователя при успешной регистрации', () => {
      const action = registerUser.fulfilled(mockAuthResponse, '', {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User'
      });
      const state = userInfoSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.errorRegister).toBeNull();
    });

    it('должен сохранять ошибку при неудачной регистрации', () => {
      const errorMessage = 'Registration failed';
      const action = registerUser.rejected(
        new Error(errorMessage),
        '',
        {
          email: 'test@example.com',
          password: 'password',
          name: 'Test User'
        },
        undefined,
        errorMessage
      );
      const state = userInfoSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.errorRegister).toBe(errorMessage);
    });
  });

  describe('экшен loginUser', () => {
    it('должен сохранять пользователя при успешном входе', () => {
      const action = loginUser.fulfilled(mockAuthResponse, '', {
        email: 'test@example.com',
        password: 'password'
      });
      const state = userInfoSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.errorLogin).toBeNull();
    });

    it('должен сохранять ошибку при неудачном входе', () => {
      const errorMessage = 'Login failed';
      const action = loginUser.rejected(
        new Error(errorMessage),
        '',
        {
          email: 'test@example.com',
          password: 'password'
        },
        undefined,
        errorMessage
      );
      const state = userInfoSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.errorLogin).toBe(errorMessage);
    });
  });

  describe('экшен logout', () => {
    it('должен очищать пользователя при выходе', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };
      const action = logout.fulfilled(undefined, '', undefined);
      const state = userInfoSlice.reducer(loggedInState, action);

      expect(state.user).toBeNull();
    });
  });

  describe('экшен getUserData', () => {
    it('должен устанавливать loading при запросе данных', () => {
      const action = getUserData.pending('', undefined);
      const state = userInfoSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сохранять пользователя при успешном получении данных', () => {
      const action = getUserData.fulfilled(
        { success: true, user: mockUser },
        '',
        undefined
      );
      const state = userInfoSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('должен сбрасывать loading при ошибке получения данных', () => {
      const action = getUserData.rejected(new Error(), '', undefined);
      const state = userInfoSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe('селекторы', () => {
    const testState = {
      user: {
        user: mockUser,
        isAuthChecked: true,
        errorRegister: null,
        errorLogin: null,
        isLoading: false
      }
    };

    it('селектор getUser должен возвращать пользователя', () => {
      const result = userInfoSlice.selectors.getUser(testState);
      expect(result).toEqual(mockUser);
    });

    it('селектор getIsAuthChecked должен возвращать статус проверки аутентификации', () => {
      const result = userInfoSlice.selectors.getIsAuthChecked(testState);
      expect(result).toBe(true);
    });
  });

  describe('редюсеры', () => {
    it('должен очищать ошибки при clearLoginError', () => {
      const stateWithErrors = {
        ...initialState,
        errorLogin: 'Login error',
        errorRegister: 'Register error'
      };
      const action = userInfoSlice.actions.clearLoginError();
      const state = userInfoSlice.reducer(stateWithErrors, action);

      expect(state.errorLogin).toBeNull();
      expect(state.errorRegister).toBeNull();
    });

    it('должен очищать пользователя при clearUserInfo', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      const action = userInfoSlice.actions.clearUserInfo();
      const state = userInfoSlice.reducer(stateWithUser, action);

      expect(state.user).toBeNull();
    });

    it('должен устанавливать пользователя при setUserInfo', () => {
      const newUser = { ...mockUser, name: 'New Name' };
      const action = userInfoSlice.actions.setUserInfo(newUser);
      const state = userInfoSlice.reducer(initialState, action);

      expect(state.user).toEqual(newUser);
    });
  });
});
