// auth-context.js
import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    localStorage.removeItem("accessToken");
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = localStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: { token: localStorage.getItem("accessToken") },
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const setToken = (token) => {
    localStorage.setItem("accessToken", token);
  };

  const signIn = async (username, password) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/pub/loginAdmin`;
    try {
      const response = await axios.post(apiUrl, {
        username,
        password,
      });

      const token = response.data.data.token;
      setToken(token);

      const responseData = response.data.data;

      const user = {
        id: responseData.userId,
        fullName: responseData.fullName,
        username: responseData.username,
        isActive: responseData.isActive,
        createdAt: responseData.createdAt,
        updatedAt: responseData.updatedAt,
        accessToken: token,
      };

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });

      return response;
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error("Invalid credentials");
    }
  };

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const getTokenFromLocalStorage = () => {
  // Check if window is defined (client-side check)
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};
export const useAuthContext = () => useContext(AuthContext);
