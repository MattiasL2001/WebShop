import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/partialComponents/ScrollToTop';
import Products from './Products';
import Register from './Register';
import Support from './Support';
import Checkout from './Checkout';
import NoPage from './NoPage';
import MyPage from './MyPage';
import Admin from "./Admin";
import ProductPage from './ProductPage';
import Page from '../components/Page';
import AdminPage from '../components/AdminPage';

const Router: React.FC = () => {
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && (
        <Page>
          <ScrollToTop/>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/home" element={<Navigate to="/products" replace />} />
            <Route path='/products'>
              <Route index element={<Products />} />
              <Route path=':id' element={<ProductPage />} />
            </Route>
            <Route path='register' element={<Register />} />
            <Route path="support" element={<Support />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            <Route path='*' element={<NoPage />} />
          </Routes>
        </Page>
      )}

      {isAdminPath && (
        <AdminPage>
          <ScrollToTop/>
          <Routes>
            <Route path="admin" element={<Admin />} />
          </Routes>
        </AdminPage>
      )}
    </>
  );
};

const UnauthorizedPage: React.FC = () => {
  return <div>Unauthorized access! Please log in to view this page.</div>;
};

export default Router;
