import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import axios from 'axios';
import { City as CityInterface } from './../interfaces';

const BASE_API = 'http://localhost:8000';

interface Context {
  cities: CityInterface[];
  isLoading: boolean;
  currentCity: CityInterface | null;
  getCity: (id: number) => void;
  postCity: (newCity: CityInterface) => void;
  deleteCity: (id: number) => void;
}
interface State {
  cities: CityInterface[];
  status: 'loading' | 'ready';
  currentCity: CityInterface | null;
}

interface Action {
  type:
    | 'storeCities'
    | 'startFetching'
    | 'finishFetching'
    | 'recivedCityData'
    | 'addCity'
    | 'deleteCity';
  payload?: [] | CityInterface | number;
}

const CitiesContext = createContext({} as Context);

const initialState: State = {
  cities: [],
  status: 'ready',
  currentCity: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'storeCities':
      return {
        ...state,
        cities: action.payload instanceof Array ? action.payload : state.cities,
      };
    case 'startFetching':
      return { ...state, status: 'loading' };
    case 'finishFetching':
      return { ...state, status: 'ready' };
    case 'recivedCityData':
      if (
        action.payload instanceof Array ||
        !action.payload ||
        typeof action.payload === 'number'
      )
        return state;
      return {
        ...state,
        currentCity: state.currentCity,
      };
    case 'addCity':
      if (
        action.payload instanceof Array ||
        !action.payload ||
        typeof action.payload === 'number'
      )
        return state;
      return { ...state, cities: [...state.cities, action.payload] };
    case 'deleteCity':
      return {
        ...state,
        cities: state.cities.filter((city) => +city.id !== action.payload),
      };
  }
}

function CitiesProvider({ children }: { children: ReactNode }) {
  const [{ cities, status, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const isLoading = status === 'loading';

  useEffect(function () {
    async function fetchCitiesData() {
      try {
        dispatch({ type: 'startFetching' });
        const cities = await axios.get(`${BASE_API}/cities`);
        dispatch({ type: 'storeCities', payload: cities.data });
      } catch (e) {
        console.log(e);
      } finally {
        dispatch({ type: 'finishFetching' });
      }
    }

    fetchCitiesData();
  }, []);

  async function getCity(id: number) {
    try {
      dispatch({ type: 'startFetching' });
      const citiy = await axios.get(`${BASE_API}/cities/${id}`);
      dispatch({ type: 'addCity', payload: citiy.data });
    } catch (err) {
      console.log('there was an error deleting a city:', err);
    } finally {
      dispatch({ type: 'finishFetching' });
    }
  }

  async function deleteCity(id: number) {
    try {
      dispatch({ type: 'startFetching' });
      await axios.delete(`${BASE_API}/cities/${id}`);
      dispatch({ type: 'deleteCity', payload: id });
    } catch (err) {
      console.log('there was an error deleting a city:', err);
    } finally {
      dispatch({ type: 'finishFetching' });
    }
  }

  async function postCity(newCity: CityInterface) {
    try {
      dispatch({ type: 'startFetching' });
      const city = await axios.post(`${BASE_API}/cities`, newCity, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(city);
      dispatch({ type: 'addCity', payload: newCity });
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: 'finishFetching' });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, postCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (typeof context === 'undefined')
    throw new Error('CitiesContext was used outside of the CitiesProvider');
  return context;
}

export { CitiesProvider, useCities };
