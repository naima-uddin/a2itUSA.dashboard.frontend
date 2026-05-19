import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // on mount, check for existing token and try to fetch user
  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("loginToken") : null;
    if (storedToken) {
      setToken(storedToken);
      fetchAuthenticatedUser(storedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAuthenticatedUser = async (loginToken) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user ?? null);
        return data.user ?? null;
      } else {
        setUser(null);
        setToken(null);
        if (typeof window !== "undefined")
          localStorage.removeItem("loginToken");
        return null;
      }
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") localStorage.removeItem("loginToken");
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        if (typeof window !== "undefined")
          localStorage.setItem("loginToken", data.token);
        setToken(data.token);
        setUser(data.user ?? null);
        return { success: true, message: data.message || "Login successful" };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return { success: false, message: "An error occurred during login." };
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("loginToken");
    setToken(null);
    setUser(null);
  };

  const changeUserPassword = async (oldPassword, newPassword) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        },
      );
      const data = await res.json();
      if (res.ok)
        return { success: true, message: data.message || "Password changed" };
      return {
        success: false,
        message: data.message || "Failed to change password",
      };
    } catch (err) {
      console.error("changeUserPassword error:", err);
      return { success: false, message: "An error occurred" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        logout,
        changeUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
