import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface props {
    children: ReactNode
}

const Page: React.FC<props> = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default Page;
