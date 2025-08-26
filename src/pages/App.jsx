import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './Products';
import Invoices from './Invoices';
import Statistics from './Statistics';
import Settings from './Settings';
import Login from './Login';


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
