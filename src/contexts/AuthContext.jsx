import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: {},
  isAuthenticated: false,
};
const fakeUserData = {
  name: "Jack",
  email: "jack@gmail.com",
  password: "1234",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: fakeUserData,
        isAuthenticated: true,
      };

    case "logout":
      return { ...state, user: {}, isAuthenticated: false };
    default:
      break;
  }
}

const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const login = (email, password) => {
    if (email === fakeUserData.email && password === fakeUserData.password) {
      dispatch({ type: "login", payload: email, password });
    }
  };

  const logout = () => {
    dispatch({ type: "logout" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    return new Error("AuthContext has been used outside of its provider");

  return context;
};

export { AuthProvider, useAuth };
