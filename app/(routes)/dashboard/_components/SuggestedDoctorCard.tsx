import React from 'react'
import {doctorAgent} from "./DoctorAgentCard"
import Image from 'next/image'

type props={
    doctorAgent:doctorAgent,
    setSelectedDoctor:any,
    selectedDoctor?:doctorAgent
}
const SuggestedDoctorCard = ({doctorAgent,setSelectedDoctor,selectedDoctor}:props) => {
  return (
    <div className={`flex flex-col items-center justify-between border p-3 rounded-lg shadow  hover:border-gray-500 hover:shadow-lg  cursor-pointer ${selectedDoctor === doctorAgent ? 'border-gray-500' : ''}`} onClick  = {()=>setSelectedDoctor(doctorAgent)}>
        <Image src = {doctorAgent.image} alt={doctorAgent.specialist} width={70} height={70}
        className='w-[70px] h-[70px] rounded-4xl object-cover' />
        <h2 className='font-bold text-sm text-center'>{doctorAgent.specialist}</h2>
        <p className='text-xs text-center line-clamp-2'>{doctorAgent.description}</p>
    </div>
  )
}

export default SuggestedDoctorCard