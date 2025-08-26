import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';

import Products from './pages/Products';
import Invoices from './pages/Invoices';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
       
          <Route path="products" element={<Products />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
