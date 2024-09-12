import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import axios from 'axios';
import { City as CityInterface } from './../interfaces';

interface Context {
  cities: CityInterface[];
  isLoading: boolean;
  currentCity: CityInterface | null;
  getCity: (id: number) => void;
}
interface State {
  cities: CityInterface[];
  status: 'loading' | 'ready';
  currentCity: CityInterface | null;
}

interface Action {
  type: 'storeCities' | 'startFetching' | 'finishFetching' | 'recivedCityData';
  payload?: [] | CityInterface;
}

const BASE_API = 'http://localhost:8000';

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
      if (action.payload instanceof Array) return state;
      return {
        ...state,
        currentCity: action.payload || state.currentCity,
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
      dispatch({ type: 'recivedCityData', payload: citiy.data });
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: 'finishFetching' });
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('CitiesContext was used outside of the CitiesProvider');
  return context;
}

export { CitiesProvider, useCities };
