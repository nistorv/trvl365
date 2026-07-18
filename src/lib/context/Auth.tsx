import { createContext, useContext, useState } from "react";

interface StoredAuthValues {
  userId: number | null;
  token: string | null;
}

function loadAuthSave(): StoredAuthValues {
  try {
    const savedAuth = localStorage.getItem('trvl365_auth');
    if (savedAuth) {
      return JSON.parse(savedAuth);
    }
  } catch {}
  return {
    userId: null,
    token: null
  };
}

export const AuthContext = createContext<{
  userId: number | null;
  token: string | null;
  login: (userId: number, token: string) => void;
  logout: () => void;
}
>({
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

interface AuthStateProps {
  children: React.ReactNode;
}

export function AuthState(props: AuthStateProps) {
  const [auth, setAuth] = useState<StoredAuthValues>(loadAuthSave);

  function login(id: number, token: string) {
    const loginAuth = { userId: id, token: token };
    setAuth(loginAuth);
    localStorage.setItem('trvl365_auth', JSON.stringify(loginAuth));
  }

  function logout() {
    setAuth({ userId: null, token: null });
    localStorage.removeItem('trvl365_auth');
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}