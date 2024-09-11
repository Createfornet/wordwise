import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import axios from 'axios';
import { City as CityInterface } from './../interfaces';

const CitiesContext = createContext(
  {} as { cities: CityInterface[]; isLoading: boolean }
);

interface State {
  cities: CityInterface[];
  status: 'loading' | 'ready';
}

interface Action {
  type: 'storeCities' | 'startFetching' | 'finishFetching';
  payload?: [];
}

const BASE_API = 'http://localhost:8000';

const initialState: State = {
  cities: [],
  status: 'ready',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'storeCities':
      return { ...state, cities: action.payload || state.cities };
    case 'startFetching':
      return { ...state, status: 'loading' };
    case 'finishFetching':
      return { ...state, status: 'ready' };
  }
}

function CitiesProvider({ children }: { children: ReactNode }) {
  const [{ cities, status }, dispatch] = useReducer(reducer, initialState);

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

  return (
    <CitiesContext.Provider value={{ cities, isLoading }}>
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
