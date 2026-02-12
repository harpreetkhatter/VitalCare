import { AIDoctorAgents } from '@/shared/list'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'

const DoctorsAgentList = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
      {AIDoctorAgents.map((doctor, index) =>
        <div key={index}>
          <DoctorAgentCard doctorAgent={doctor} />
        </div>
      )}
    </div>
  )
}

export default DoctorsAgentList
