import { createContext, useEffect, useContext, useReducer } from "react";

const CitiesContext = createContext();

const API_URL = "https://67d151d1825945773eb3da17.mockapi.io/cities";

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

    case "city/loaded":
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
        const res = await fetch(API_URL);
        const data = await res.json();

        // Transform data to include a nested position object
        const transformedData = data.map((city) => ({
          ...city,
          position: { lat: city.lat, lng: city.lng }, // Add position object
        }));

        dispatch({ type: "cities/loaded", payload: transformedData });
      } catch (error) {
        dispatch({ type: "rejected", payload: error.message });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();

      // Ensure city has a position object
      const transformedCity = {
        ...data,
        position: { lat: data.lat, lng: data.lng },
      };

      dispatch({ type: "city/loaded", payload: transformedCity });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(
        `https://67d151d1825945773eb3da17.mockapi.io/cities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCity),
        }
      );
      const data = await res.json();

      dispatch({ type: "cities/create", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`https://67d151d1825945773eb3da17.mockapi.io/cities/${id}`, {
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
