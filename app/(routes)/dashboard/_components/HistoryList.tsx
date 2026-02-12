"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AddNewSession from './AddNewSession';
import axios from 'axios';
import HistoryTable from './HistoryTable';
import { SessionDetail } from '../types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  useEffect(() => {
    GetHistoryList();
  }, [])
  const GetHistoryList = async () => {
    const result = await axios.get("/api/session-chat?sessionId=all")
    console.log(result.data);
    setHistoryList(result.data);

  }
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Recent Consultations</h2>
          <p className='text-gray-600 text-sm mt-1'>Your latest medical consultations and reports</p>
        </div>
        {historyList.length > 0 && (
          <Link href="/dashboard/reports">
            <Button variant="outline" className="gap-2">
              View All Reports
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      {historyList.length == 0 ?
        <div className='flex items-center flex-col justify-center p-10 border border-dashed rounded-2xl border-2 gap-3 bg-gray-50'>
          <Image src={'/medical-assistance.png'} alt='empty' width={150} height={150} />
          <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
          <p className='text-gray-600'>It looks like you haven't consulted with any doctors yet.</p>
          <AddNewSession />
        </div> :
        <div className='bg-white rounded-2xl border border-gray-200 overflow-hidden'>
          <HistoryTable historyList={historyList.slice(0, 5)} />
          {historyList.length > 5 && (
            <div className='p-4 bg-gray-50 border-t border-gray-200 text-center'>
              <Link href="/dashboard/reports">
                <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                  View {historyList.length - 5} more consultations
                </Button>
              </Link>
            </div>
          )}
        </div>
      }
    </div>
  )
}

export default HistoryList
