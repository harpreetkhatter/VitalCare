"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
type SessioDetail = {
  id: number,
  sessionId: string,
  createdBy: string,
  notes: string,
  selectedDoctor: doctorAgent,
  report: JSON,
  createdOn: Date,

}
type messages = {
  role: string,
  text: string
}

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessioDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId])

  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  }
  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);
    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
    vapi.on('call-start', () => { setCallStarted(true); console.log('Call started'); });
    vapi.on('call-end', () => { setCallStarted(false); console.log('Call ended'); });
    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const { role, transcript, transcriptType } = message;
        console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType === 'partial') {

          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === 'final') {
          //fINAL TRANSCRIPT
          setMessages((prevMessages) => [...prevMessages, { role: role, text: transcript }]);
          setLiveTranscript('');
          setCurrentRole('');

        }
      }
    });
    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRole('assistant');
    });
    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRole('user');
    });
  }
  const endCall = () => {

    if (!vapiInstance) {
      return;
    }
    vapiInstance.stop();
    vapiInstance.off('call-start');
    vapiInstance.off('call-end');
    vapiInstance.off('message');
    setCallStarted(false);
    setVapiInstance(null);
    setLiveTranscript('');
    setCurrentRole('');
    setMessages([]);
  };
  return (
    <div className='p-5 border rounded-2xl bg-secondary '>
      <div className='flex justify-between items-center mt-6 '>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'><Circle className={`h-4 w-4 rounded-full ${!callStarted ? 'bg-red-500' : 'bg-green-500'}`} />{!callStarted ? 'Not Connected' : 'Connected'}</h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>
      {sessionDetail && <div className='flex flex-col justify-center items-center  mt-10'>
        <div className='flex flex-col justify-center items-center'>
          <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist} width={120} height={120}
            className='h-[100px] w-[100px] object-cover rounded-full' />
          <h2 className='mt-2 font-bold text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
          <p className='text-gray-500 text-sm'>Ai Voice Agent</p>
        </div>

        <div className='mt-12 flex flex-col justify-center items-center overflow-y-auto px-10 md:px-28 lg:px-52 xl:px-72 '>
          {messages?.slice(-4).map((message, index) => (
            <h2 key={index} className='text-gray-500 p-2'>{message.role === "user" ? "You" : "Assistant"}: {message.text}</h2>
          ))}

          {liveTranscript && <h2 className='text-lg '> {currentRole == "user" ? "You" : "Assistant"}: {liveTranscript}</h2>}
        </div>

        {!callStarted ? <Button className='mt-10 cursor-pointer' onClick={StartCall}>
          <PhoneCall />Start Call</Button> :
          <Button variant={"destructive"} className='mt-10 cursor-pointer' onClick={endCall}>
            <PhoneOff />Disconnect</Button>
        }
      </div>
      }
    </div>
  )
}

export default MedicalVoiceAgent


