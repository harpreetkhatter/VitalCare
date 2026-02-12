"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SessionDetail } from '../types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ViewReportDialog from '../_components/ViewReportDialog';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'month';

const History = () => {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [filteredList, setFilteredList] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<SessionDetail | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const router = useRouter();

  useEffect(() => {
    GetHistoryList();
  }, [])

  useEffect(() => {
    filterConsultations(activeFilter);
  }, [historyList, activeFilter])

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

  const filterConsultations = (filter: FilterType) => {
    if (filter === 'all') {
      setFilteredList(historyList);
    } else if (filter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      setFilteredList(historyList.filter(item =>
        item.createdOn && new Date(item.createdOn) >= oneMonthAgo
      ));
    }
  }

  const getSymptoms = (session: SessionDetail) => {
    const report = session.report as any;
    if (report?.chiefComplaint) {
      return report.chiefComplaint;
    }
    if (report?.symptoms && report.symptoms.length > 0) {
      return report.symptoms.join(', ');
    }
    if (session.notes && session.notes !== 'New Query') {
      return session.notes.length > 100 ? session.notes.substring(0, 100) + '...' : session.notes;
    }
    return 'General consultation';
  }

  const getSummary = (session: SessionDetail) => {
    const report = session.report as any;
    if (report?.summary) {
      return report.summary.length > 150 ? report.summary.substring(0, 150) + '...' : report.summary;
    }
    return null;
  }

  const getStatus = (session: SessionDetail) => {
    const report = session.report as any;
    if (report && Object.keys(report).length > 0) {
      return 'COMPLETED';
    }
    return 'PENDING';
  }

  const handleFollowUp = async (session: SessionDetail) => {
    try {
      const result = await axios.post("/api/session-chat", {
        notes: `Follow-up consultation for: ${getSymptoms(session)}`,
        selectedDoctor: session.selectedDoctor,
      });

      if (result.data[0].sessionId) {
        router.push("/dashboard/medical-agent/" + result.data[0].sessionId);
      }
    } catch (error) {
      console.error("Error creating follow-up:", error);
    }
  }

  return (
    <div className='max-w-5xl mx-auto space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Consultation History</h1>
        <p className='text-gray-600 mt-2'>View all your past consultations and reports</p>
      </div>

      {/* Filters */}
      <div className='flex gap-3'>
        <Button
          onClick={() => setActiveFilter('all')}
          className={`rounded-full px-6 font-medium transition-all ${activeFilter === 'all'
            ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
          All Sessions
        </Button>
        <Button
          onClick={() => setActiveFilter('month')}
          className={`rounded-full px-6 font-medium transition-all ${activeFilter === 'month'
            ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
          This Month
        </Button>
      </div>

      {/* Consultations List */}
      {loading ? (
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='animate-pulse bg-white rounded-2xl p-6 border-2 border-gray-100'>
              <div className='flex items-start gap-4'>
                <div className='w-16 h-16 bg-gray-200 rounded-2xl'></div>
                <div className='flex-1 space-y-3'>
                  <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                  <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-2xl border-2 border-gray-100'>
          <Image src='/medical-assistance.png' alt='empty' width={140} height={140} className='mx-auto mb-4 opacity-40' />
          <p className='text-gray-900 text-xl font-bold'>No consultations found</p>
          <p className='text-gray-500 mt-2'>Try changing the filter or start a new consultation</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredList.map((session, index) => (
            <div key={index} className='bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all'>
              <div className='flex items-start gap-5'>
                {/* Doctor Image */}
                <div className='w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-teal-100 to-teal-200 shadow-sm'>
                  <Image
                    src={session.selectedDoctor?.image || '/medical-assistance.png'}
                    alt='doctor'
                    width={64}
                    height={64}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-4 mb-3'>
                    <div>
                      <h3 className='font-bold text-xl text-gray-900'>
                        {session.selectedDoctor?.specialist || 'General Physician'}
                      </h3>
                      <p className='text-sm text-gray-500 mt-1'>
                        {session.createdOn ? new Date(session.createdOn).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) + ' • ' + new Date(session.createdOn).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        }) : 'Recent'}
                      </p>
                    </div>
                    <Badge
                      className={`${getStatus(session) === 'COMPLETED'
                        ? 'bg-teal-100 text-teal-700 hover:bg-teal-100 border-teal-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200'
                        } font-semibold border px-3 py-1`}
                    >
                      {getStatus(session)}
                    </Badge>
                  </div>

                  <div className='space-y-2 mb-5'>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      <span className='font-semibold text-gray-900'>Symptoms:</span> {getSymptoms(session)}
                    </p>
                    {getSummary(session) && (
                      <p className='text-sm text-gray-700 leading-relaxed'>
                        <span className='font-semibold text-gray-900'>Summary:</span> {getSummary(session)}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-3'>
                    <Button
                      onClick={() => setSelectedReport(session)}
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium"
                    >
                      View Report
                    </Button>
                    {getStatus(session) === 'COMPLETED' && (
                      <Button
                        onClick={() => handleFollowUp(session)}
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl gap-2 font-medium shadow-md"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Follow up
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default History
