import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './Products';
import Register from './Register';
import Login from './Login';
import Support from './Support';
import Checkout from './Checkout';
import NoPage from './NoPage';
import MyPage from './MyPage';
import Admin from "./Admin" 
import ProductPage from './ProductPage';
import { GetProducts } from '../services/webShopServices';
import { Product } from '../components/models/Product';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import ProductItems from '../components/partialComponents/PorductItems';
import Page from '../components/Page';

const Router: React.FC = () => {

    const fakeProduct : Product[] = [{id: 999, name: "No Product", description: "No Description", price: 0, image: "", productAmount: 0, productColor: 999, productGender: 999, productType: 999} ]

    const [products,setProducts] = useState(fakeProduct)

    const productsQuery = useQuery({
        queryKey: ['products',products],
        queryFn: async () => {

            let products = await GetProducts()

            setProducts(products)
        }
    });

    return (

        <Page>
            <Routes>
                <Route />
                <Route path='/products'>
                    {/* <Route element={<Home/>}/> */}
                    <Route index element={<Products products={products}/>}/>
                    <Route path=':id' element={<ProductPage/>}/>
                </Route>
                <Route path='*' element={<NoPage/>}/>
            </Routes>
        </Page>
    )
//         <Page>
//             <Routes location="/home">
//                     <Route path="home" element={<Home/>}>
//                         <Route index element={<ProductItems/>} />
//                         <Route path=":id" element={<ProductPage/>} />
//                     </Route>
//                     <Route path="register" element={<Register />} />
//                     <Route path="login" element={<Login />} />
//                     <Route path="support" element={<Support />} />
//                     <Route path="checkout" element={<Checkout />} />
//                     <Route path="mypage" element={<MyPage />} />
//                     <Route path="admin" element={<Admin />} />
//                     <Route path="unauthorized" element={<UnauthorizedPage />} />
//                 <Route path='*' element={<NoPage />} />
//             </Routes>
//         </Page>    
// )
}
 
const UnauthorizedPage: React.FC = () => {
    return <div>Unauthorized access! Please log in to view this page.</div>;
};

export default Router