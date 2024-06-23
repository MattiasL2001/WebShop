import React, { ReactNode } from 'react';
import AdminHeader from './AdminHeader';
import Footer from './Footer';
import "../styles/admin.scss"

interface props {
    children: ReactNode
}

const AdminPage: React.FC<props> = ({ children }) => {
    return (
        <>
            <AdminHeader />
            {children}
            <Footer />
        </>
    );
};

export default AdminPage;
