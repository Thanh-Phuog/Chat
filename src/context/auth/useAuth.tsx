"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthContextType } from "./authContextType";
import { useRouter } from "next/navigation";
import { UserModel } from "../../api/features/authenticate/model/LoginModel";

class AuthManager {
  private static instance: AuthManager;
  private user: UserModel | null = null;
  private isAuthenticated: boolean = false;
  private router: any;
  private listeners: Array<() => void> = [];

  private constructor(router: any) { 
    if (!AuthManager.instance) {
      AuthManager.instance = this;  
    }
    this.router = router;
  }

  public static getInstance(router?: any): AuthManager { 
    if (!AuthManager.instance && router)
      return new AuthManager(router);
    return AuthManager.instance!;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }


  public getUser() {
    return this.user;
  }

  public getIsAuthenticated() {
    return this.isAuthenticated;
  }

  public onLogin(user: any) {

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem("user", JSON.stringify(user.data.user));
      localStorage.setItem("accessToken", user.data.accessToken);
    }

    this.isAuthenticated = true;
    this.user = user.data.user;
    this.notifyListeners();
    this.router.push("/home");
  }

  public onSignUp(user: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem("user", JSON.stringify(user.data.user));
      localStorage.setItem("accessToken", user.data.accessToken);
    }

    this.isAuthenticated = true;
    this.user = user.data.user;
    this.notifyListeners();
    this.router.push("/home");
  }

  public onUpdateProfile(user: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(user));
    }

    this.isAuthenticated = true;
    this.user = user;
    this.notifyListeners();
  }

  public async onLogout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

    }
    this.isAuthenticated = false;
    this.user = null;
    this.notifyListeners();
    this.router.push("/home");
  }

  public isLoginUser(userId: string) {
    return this.user?.id === userId;
  }

  public checkAuthStatus() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem("user");
      const storedAccessToken = localStorage.getItem("accessToken");

      try {
        if (storedUser && storedAccessToken) {
          this.user = JSON.parse(storedUser);
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      } catch (error) { 
        localStorage.removeItem("user");
        this.isAuthenticated = false;
      }
    }
    this.notifyListeners();
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const authManager = AuthManager.getInstance(router);  

  const [state, setState] = useState({});

  useEffect(() => {
    const unsubscribe = authManager.subscribe(() => {
      setState({});
    });
    return unsubscribe;
  }, [authManager]);

  useEffect(() => {  
    authManager.checkAuthStatus(); 
  }, []);

  return (
    <AuthContext.Provider
      value={{
        onSignUp: authManager.onSignUp.bind(authManager),
        onLogin: authManager.onLogin.bind(authManager),
        onLogout: authManager.onLogout.bind(authManager),
        isAuthenticated: authManager.getIsAuthenticated(),
        user: authManager.getUser(),
        onUpdateProfile: authManager.onUpdateProfile.bind(authManager),
        isLoginUser: authManager.isLoginUser.bind(authManager),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
