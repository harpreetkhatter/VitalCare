"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from "next/navigation";
import axios from "axios"
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

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
    return <div className="animate-pulse bg-gray-200 rounded-xl h-[320px]"></div>;
  }

  const paidUser = has({ plan: "pro" });
  const onStartConsultation = async () => {
    setLoading(true);
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
    <div className='relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group'>
      {doctorAgent.subscriptionRequired && (
        <Badge className='absolute top-3 right-3 z-10 bg-teal-600 hover:bg-teal-700 border-0 text-white text-xs font-semibold px-2.5 py-1 shadow-md'>
          <Sparkles className="w-3 h-3 mr-1" />
          PRO
        </Badge>
      )}

      <div className='relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'>
        <Image
          src={doctorAgent.image}
          alt={doctorAgent.specialist}
          width={300}
          height={300}
          className='w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300'
        />
      </div>

      <div className='p-4'>
        <h3 className='font-bold text-base text-gray-900 mb-1'>{doctorAgent.specialist}</h3>
        <p className='text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed'>{doctorAgent.description}</p>

        <Button
          className='w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-5 font-semibold text-sm transition-all shadow-md hover:shadow-lg'
          disabled={(!paidUser && doctorAgent.subscriptionRequired) || loading}
          onClick={onStartConsultation}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              Start Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default DoctorAgentCard
