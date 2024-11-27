import React from 'react';
import Navbar from '../Navbar/Navbar';

const Layout = ({ children }) => {
    return (
        <div className="bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto py-2">
                {children}
            </div>
        </div>
    );
};

export default Layout;