"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AddNewSession from './AddNewSession';

function HistoryList(){
const [historyList,setHistoryList] = useState([]);
  return (
    <div className='mt-10'>
        {historyList.length==0?
        <div className='flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2 gap-1'>
            <Image src ={'/medical-assistance.png'} alt='empty' width={150} height={150}/>
            <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
            <p>It looks like you haven't consulted with any doctors yet.</p>
            <AddNewSession/>
        </div> :
        <div>List</div>
    }
    </div>
  )
}

export default HistoryList