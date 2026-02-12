import React from 'react'
import { doctorAgent } from "./DoctorAgentCard"
import Image from 'next/image'
import { Check } from 'lucide-react'

type props = {
  doctorAgent: doctorAgent,
  setSelectedDoctor: any,
  selectedDoctor?: doctorAgent
}
const SuggestedDoctorCard = ({ doctorAgent, setSelectedDoctor, selectedDoctor }: props) => {
  const isSelected = selectedDoctor?.id === doctorAgent?.id

  return (
    <div
      className={`relative flex flex-col items-center justify-between border-2 p-4 rounded-2xl shadow-sm hover:shadow-lg cursor-pointer transition-all ${isSelected ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      {isSelected && (
        <div className='absolute top-2 right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center'>
          <Check className='w-4 h-4 text-white' />
        </div>
      )}

      <div className='w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200 mb-3'>
        {doctorAgent?.image ? (
          <Image
            src={doctorAgent.image}
            alt={doctorAgent.specialist || 'Doctor'}
            width={80}
            height={80}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-teal-600 font-bold text-2xl'>
            {doctorAgent?.specialist?.charAt(0) || 'D'}
          </div>
        )}
      </div>

      <h2 className='font-bold text-sm text-center text-gray-900 mb-1'>
        {doctorAgent?.specialist || 'Specialist'}
      </h2>
      <p className='text-xs text-center line-clamp-2 text-gray-600'>
        {doctorAgent?.description || 'Medical specialist'}
      </p>
    </div>
  )
}

export default SuggestedDoctorCard