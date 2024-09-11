import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Home from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login';
import AppLayout from './pages/AppLayout';
import CityList from './components/CityList';
import CountriesList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import { CitiesProvider } from './contexts/CitiesContext';

function App() {
  return (
    <CitiesProvider>
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<Home />} />

          <Route path='product' element={<Product />} />

          <Route path='pricing' element={<Pricing />} />

          <Route path='login' element={<Login />} />

          <Route path='app' element={<AppLayout />}>
            <Route index element={<Navigate to='cities' />} />

            <Route path='cities' element={<CityList />} />

            <Route path='cities/:id' element={<City />} />

            <Route path='countries' element={<CountriesList />} />

            <Route path='form' element={<Form />} />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  );
}

export default App;
