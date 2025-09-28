import { createContext, useState, useEffect } from "react";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    email: localStorage.getItem("email") || null,
    token: localStorage.getItem("token") || null
  });
   const [cartUpdated, setCartUpdated] = useState(false);
  useEffect(() => {
    if (auth.email) {
      localStorage.setItem("email", auth.email);
    } else {
      localStorage.removeItem("email");
    }

    if (auth.token) {
      localStorage.setItem("token", auth.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [auth]); // ✅ only runs when auth changes

  return (
    <authContext.Provider value={{ auth, setAuth ,cartUpdated, setCartUpdated}}>
      {children}
    </authContext.Provider>
  );
};
