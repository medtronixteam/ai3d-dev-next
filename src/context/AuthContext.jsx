import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../config';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null);
  // const [token, setToken] = useState(localStorage.getItem('token'));

  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem('tokens');
      // console.log('Loading tokens from localStorage:', saved);
      const parsedTokens = saved ? JSON.parse(saved) : [];
      // console.log('Parsed tokens:', parsedTokens);
      return parsedTokens;
    } catch (error) {
      console.error('Error loading tokens from localStorage:', error);
      return [];
    }
  });

  // Active team selection (persisted)
  const [activeTeam, setActiveTeamState] = useState(() => {
    try {
      const saved = localStorage.getItem('activeTeam');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading activeTeam from localStorage:', e);
      return null;
    }
  });

  // active account hamesha tokens se nikaalo
  const activeAccount = tokens.find((acc) => acc.is_active === 1) || null;

  // Global 401 interceptor
  /*
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (
          error.response &&
          error.response.status === 401 &&
          !(error.config && error.config.skipAuthInterceptor)
        ) {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.replace('/signin');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
  */

  // persist tokens
  // useEffect(() => {
  //   localStorage.setItem('tokens', JSON.stringify(tokens));
  // }, [tokens]);

  useEffect(() => {
    try {
      const tokensJson = JSON.stringify(tokens);
      // console.log('Saving tokens to localStorage:', tokensJson);
      localStorage.setItem('tokens', tokensJson);
      
      // Verify save operation
      const verified = localStorage.getItem('tokens');
      if (verified !== tokensJson) {
        console.error('Failed to save tokens to localStorage');
      }
    } catch (error) {
      console.error('Error saving tokens to localStorage:', error);
    }
  }, [tokens]);

  // Persist activeTeam
  useEffect(() => {
    try {
      if (activeTeam) {
        localStorage.setItem('activeTeam', JSON.stringify(activeTeam));
      } else {
        localStorage.removeItem('activeTeam');
      }
    } catch (e) {
      console.error('Error saving activeTeam to localStorage:', e);
    }
  }, [activeTeam]);

  // useEffect(() => {
  //   if (token) {
  //     let userObj = null;
  //     try {
  //       const userStr = localStorage.getItem('user');
  //       userObj = userStr ? JSON.parse(userStr) : null;
  //     } catch (e) {
  //       userObj = null;
  //     }
  //     setUser(userObj && typeof userObj === 'object' ? userObj : { token });
  //   } else {
  //     setUser(null);
  //   }
  // }, [token]);

  // AuthContext.js mein ye login function replace kar dein

// AuthContext.js mein ye login function replace kar dein

const login = (newToken, userData) => {
  console.log('Login function called with:', { newToken, userData });
  
  if (!newToken) {
    console.error('No token provided');
    return;
  }
  
  if (!userData) {
    console.error('No user data provided');
    return;
  }
  
  if (!userData.email) {
    console.error('No email in user data:', userData);
    return;
  }

  console.log('Logging in user:', userData.email);

  setTokens((prev) => {
    console.log('Previous tokens:', prev);
    
    const exists = prev.find((acc) => acc?.email === userData.email);
    let updated;

    if (exists) {
      // Existing account ko update kar rahe hain
      updated = prev.map((acc) =>
        acc?.email === userData.email
          ? { ...acc, ...userData, token: newToken, is_active: 1 }
          : { ...acc, is_active: 0 }, // Baaki sab ko inactive
      );
      console.log('Updated existing account:', userData.email);
    } else {
      // Naya account add kar rahe hain
      updated = [
        ...prev.map((acc) => ({ ...acc, is_active: 0 })), // Purane sab inactive
        { ...userData, token: newToken, is_active: 1 }, // Naya active
      ];
      console.log('Added new account:', userData.email);
    }

    console.log('Updated tokens array:', updated);
    return updated;
  });

  // Force axios header update
  setTimeout(() => {
    if (newToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      console.log('Authorization header updated');
    }
  }, 50);
};

  // signup
  const signup = async (data) => {
    try {
      const res = await axios.post(`${baseURL}/auth/signup`, data);
      setTokens((prev) => [
        ...prev.map((acc) => ({ ...acc, is_active: 0 })),
        { ...res.data.user, token: res.data.token, is_active: 1 },
      ]);
    } catch (err) {
      throw err;
    }
  };

  // const logout = async () => {
  //   try {
  //     if (token) {
  //       await axios.post(`${baseURL}/logout`, {}, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //     }
  //   } catch (err) {
  //   } finally {
  //     setToken(null);
  //     setUser(null);
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //   }
  // };

  // logout only removes active account
  const logout = async () => {
    if (activeAccount?.token) {
      try {
        await axios.post(
          `${baseURL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${activeAccount.token}` } },
        );
      } catch (err) {
        console.warn('Logout failed:', err);
      }
    }
    setTokens((prev) => prev.filter((acc) => acc.is_active !== 1));
    // Clear team selection on logout of active account
    setActiveTeamState(null);
  };

  // remove account
  const removeAccount = (email) => {
    const updated = tokens.filter((acc) => acc.email !== email);
    if (updated.length > 0) {
      // pehla bacha account ko active bana do
      setTokens(updated.map((acc, i) => ({ ...acc, is_active: i === 0 ? 1 : 0 })));
    } else {
      setTokens([]);
    }
  };

  // switch account
  const switchAccount = (email) => {
    setTokens((prev) =>
      prev.map((acc) => ({
        ...acc,
        is_active: acc.email === email ? 1 : 0,
      })),
    );
    // Clear team selection when switching personal account
    setActiveTeamState(null);
  };

  // active account ke hisaab se axios header set karo
  useEffect(() => {
    if (activeAccount?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${activeAccount.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [activeAccount]);

  return (
    <AuthContext.Provider
      value={{
        tokens,
        user: activeAccount,
        token: activeAccount?.token || null,
        activeTeam,
        setActiveTeam: setActiveTeamState,
        clearActiveTeam: () => setActiveTeamState(null),
        login,
        signup,
        logout,
        removeAccount,
        switchAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
