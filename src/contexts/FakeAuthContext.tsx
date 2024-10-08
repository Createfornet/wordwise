import { createContext, ReactNode, useContext, useReducer } from 'react';

interface Context {
  user: User | null;
  isAuthenicated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

interface User {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

interface State {
  user: User | null;

  isAuthenicated: boolean;
}

interface Action {
  type: 'login' | 'logout';
  payload?: User;
}

const AuthContext = createContext({} as Context);

const initialState: State = {
  user: null,
  isAuthenicated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'login':
      if (!action.payload) return state;
      return { ...state, user: action.payload, isAuthenicated: true };

    case 'logout':
      return initialState;
  }
}

const FAKE_USER: User = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [{ user, isAuthenicated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: 'login', payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenicated, login, logout } as Context}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (typeof context === 'undefined')
    throw new Error('AuthContext was used outside of AuthProvider');
  return context;
}

export { AuthProvider, useAuth };
