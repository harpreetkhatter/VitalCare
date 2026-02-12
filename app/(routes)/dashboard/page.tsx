"use client"
import React, { useEffect, useState } from 'react';
import DoctorsAgentList from './_components/DoctorsAgentList';
import AddNewSession from './_components/AddNewSession';
import { Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { SessionDetail } from './types';
import Image from 'next/image';
import { useUser, useAuth } from '@clerk/nextjs';
import ViewReportDialog from './_components/ViewReportDialog';

function Dashboard() {
    const { user } = useUser();
    const { has } = useAuth();
    const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<SessionDetail | null>(null);

    useEffect(() => {
        GetHistoryList();
    }, [])

    const GetHistoryList = async () => {
        try {
            const result = await axios.get("/api/session-chat?sessionId=all")
            setHistoryList(result.data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }

    // Helper function to extract symptoms from report or notes
    const getSymptoms = (session: SessionDetail) => {
        const report = session.report as any;
        if (report?.chiefComplaint) {
            return report.chiefComplaint;
        }
        if (report?.symptoms && report.symptoms.length > 0) {
            return report.symptoms[0];
        }
        if (session.notes && session.notes !== 'New Query') {
            return session.notes.length > 50 ? session.notes.substring(0, 50) + '...' : session.notes;
        }
        return 'General consultation';
    }

    // Calculate total call duration
    const getTotalCallTime = () => {
        const totalSeconds = historyList.reduce((acc, session) => {
            return acc + (session.callDuration || 0);
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    return (
        <div className='max-w-7xl mx-auto space-y-6'>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>My Dashboard</h1>
                    <p className='text-gray-600 text-sm mt-1'>
                        Welcome back, {user?.firstName || user?.fullName || 'User'}! Here is your health summary
                    </p>
                </div>
                <AddNewSession />
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white rounded-xl p-5 border border-gray-200'>
                    <div className='flex items-center justify-between mb-3'>
                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                            <Calendar className='w-5 h-5 text-blue-600' />
                        </div>
                        <span className='text-xs text-gray-500 font-medium'>THIS MONTH</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900'>{historyList.length}</p>
                    <p className='text-sm text-gray-600 mt-1'>Total Consultations</p>
                </div>

                <div className='bg-white rounded-xl p-5 border border-gray-200'>
                    <div className='flex items-center justify-between mb-3'>
                        <div className='w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center'>
                            <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className='text-xs text-gray-500 font-medium'>TOTAL TIME</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900'>{getTotalCallTime()}</p>
                    <p className='text-sm text-gray-600 mt-1'>Call Duration</p>
                </div>

                <div className='bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white'>
                    <div className='flex items-center justify-between mb-3'>
                        <div className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                            <TrendingUp className='w-5 h-5 text-white' />
                        </div>
                        <span className='text-xs text-teal-100 font-medium'>ACTIVE</span>
                    </div>
                    <p className='text-2xl font-bold'>{has && has({ plan: "pro" }) ? 'Premium Plan' : 'Free Plan'}</p>
                    <p className='text-sm text-teal-100 mt-1'>
                        {has && has({ plan: "pro" }) ? 'Unlimited access' : '1 consultation/month'}
                    </p>
                </div>
            </div>

            {/* Recent Reports Section */}
            <div className='bg-white rounded-xl p-6 border border-gray-200'>
                <div className='flex justify-between items-center mb-5'>
                    <h2 className='text-lg font-bold text-gray-900'>Recent Reports</h2>
                    <Link href="/dashboard/history">
                        <Button variant="link" className="text-teal-600 hover:text-teal-700 p-0 h-auto font-semibold">
                            See all
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className='space-y-3'>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className='animate-pulse flex items-center gap-3 p-3'>
                                <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                                    <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : historyList.length === 0 ? (
                    <div className='text-center py-8'>
                        <Image src='/medical-assistance.png' alt='empty' width={100} height={100} className='mx-auto mb-3 opacity-50' />
                        <p className='text-gray-600 text-sm'>No consultations yet</p>
                        <p className='text-gray-500 text-xs mt-1'>Start your first consultation to see reports here</p>
                    </div>
                ) : (
                    <div className='space-y-3'>
                        {historyList.slice(0, 3).map((session, index) => (
                            <div
                                key={index}
                                className='flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100'
                            >
                                <div className='flex items-center gap-4'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0'>
                                        <Image
                                            src={session.selectedDoctor?.image || '/medical-assistance.png'}
                                            alt='doctor'
                                            width={48}
                                            height={48}
                                            className='rounded-full object-cover w-12 h-12'
                                        />
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 text-base'>
                                            {session.selectedDoctor?.specialist || 'General Physician'}
                                        </p>
                                        <p className='text-sm text-gray-600 mt-0.5'>
                                            {getSymptoms(session)} • {session.createdOn ? new Date(session.createdOn).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : 'Recent'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setSelectedReport(session)}
                                    variant="outline"
                                    className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700 font-bold px-6 rounded-lg"
                                >
                                    REPORT
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Specialists Section */}
            <div>
                <div className='mb-5'>
                    <h2 className='text-lg font-bold text-gray-900'>AI Specialists</h2>
                    <p className='text-sm text-gray-600 mt-1'>Choose from our expert AI medical specialists</p>
                </div>
                <DoctorsAgentList />
            </div>

            {/* View Report Dialog */}
            {selectedReport && (
                <ViewReportDialog
                    report={selectedReport.report}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    )
}
export default Dashboard;
