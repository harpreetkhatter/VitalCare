import React from 'react';
import AppHeader from './_components/AppHeader';
import Footer from '@/components/Footer';

function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppHeader />
            <div className='flex-1 px-6 md:px-10 lg:px-20 py-8'>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default DashboardLayout;
