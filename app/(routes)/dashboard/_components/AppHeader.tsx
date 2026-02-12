"use client"
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import Link from "next/link"
import { usePathname } from 'next/navigation'

const menuOptions = [
    { id: 1, name: "Dashboard", path: "/dashboard" },
    { id: 2, name: "History", path: "/dashboard/history" },
    { id: 3, name: "Billing", path: "/dashboard/billing" },
    { id: 4, name: "Profile", path: "/dashboard/profile" },
]

const AppHeader = () => {
    const pathname = usePathname()

    return (
        <header className='bg-white border-b border-gray-200'>
            <div className='flex items-center justify-between px-6 md:px-10 lg:px-20 py-4'>
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <rect x="8" y="4" width="2" height="14" rx="1" fill="white" />
                            <rect x="4" y="8" width="14" height="2" rx="1" fill="white" />
                            <circle cx="11" cy="11" r="1.5" fill="white" opacity="0.5" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">VitalCare<span className="text-teal-600">AI</span></span>
                </Link>

                {/* Navigation */}
                <nav className='hidden md:flex gap-8 items-center'>
                    {menuOptions.map((option) => {
                        const isActive = pathname === option.path
                        return (
                            <Link key={option.id} href={option.path}>
                                <span className={`font-medium transition-colors cursor-pointer ${isActive ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'
                                    }`}>
                                    {option.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Button */}
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-10 h-10"
                        }
                    }}
                />
            </div>
        </header>
    )
}

export default AppHeader
