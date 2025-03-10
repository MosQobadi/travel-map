import { createContext, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "cities/create":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };

    case "cities/delete":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case "loading":
      return { ...state, isLoading: true };

    case "city/laoded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "rejected":
      return { ...state, error: action.payload };

    default:
      break;
  }
}

function CititesProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        const res = await fetch("http://localhost:8000/cities");
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:8000/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/laoded", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:8000/cities`, {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();

      dispatch({ type: "cities/create", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "cities/delete", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

const useCities = () => {
  const context = useContext(CitiesContext);

  if (context === undefined) {
    throw new Error("CitiesContext was used outside of the CititesProvider");
  }

  return context;
};

export { CititesProvider, useCities };
