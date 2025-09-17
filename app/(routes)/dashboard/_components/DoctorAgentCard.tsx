"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from "next/navigation";
import axios from "axios"
import { Loader2 } from "lucide-react";



export type doctorAgent = {
  id: number,
  specialist: string,
  description: string,
  image: string,
  agentPrompt: string,
  voiceId: string,
  subscriptionRequired: boolean
}
type props = {
  doctorAgent: doctorAgent
}
const DoctorAgentCard = ({ doctorAgent }: props) => {

  const [loading, setLoading] = useState(false)

  const router = useRouter();
  const { has } = useAuth()
  if (!has) {
    return <h1>Loading...</h1>;
  }

  const paidUser = has({ plan: "pro" });
  const onStartConsultation = async () => {
    setLoading(true);
    //save all info to database
    const result = await axios.post("/api/session-chat", {
      notes: "New Query",
      selectedDoctor: doctorAgent,
    });
    console.log(result.data);

    if (result.data[0].sessionId) {

      console.log(result.data[0].sessionId);
      router.push("/dashboard/medical-agent/" + result.data[0].sessionId);
    }

    setLoading(false);

  }

  return (
    <div className='relative'>
      {doctorAgent.subscriptionRequired && <Badge className='absolute m-2 right-0'>
        Premium
      </Badge>}

      <Image src={doctorAgent.image} alt={doctorAgent.specialist} width={200} height={300}
        className='w-full h-[250px] object-cover rounded-xl' />
      <h2 className='font-bold text-lg'>{doctorAgent.specialist}</h2>
      <p className='line-clamp-2  text-sm text-gray-500'>{doctorAgent.description}</p>
      <Button className='w-full mt-2 ' disabled={!paidUser && doctorAgent.subscriptionRequired} onClick={onStartConsultation}>Start Consultation {loading? <Loader2 className="animate-spin"/>:<IconArrowRight />} </Button>
    </div>
  )
}

export default DoctorAgentCard