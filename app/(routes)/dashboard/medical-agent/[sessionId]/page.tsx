"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
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
  const StartCall = async () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);
    const VapiConfig = {
      name: "AI Medical Doctor Voice Agent ",
      firstMessage: "Hello, I am your AI medical assistant. I am here to help you with your medical concerns. How can I assist you today?",
      transcriber: {
        provider: "assembly-ai",
        language: "en"
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetail?.selectedDoctor.voiceId
      }, model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor.agentPrompt
          }
        ]
      }
    }//@ts-ignore
    vapi.start(VapiConfig);
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
    vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRole('assistant');
    });
    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRole('user');
    });
  }
  const endCall = async () => {
    setLoading(true);
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

    const res = await GenerateReport();
    setLoading(false);

  };
  const GenerateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      sessionId: sessionId, messages: messages, sessionDetail: sessionDetail
    });
    console.log(result.data);
    return result.data;
  }
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

        {!callStarted ?
          <Button className='mt-10 cursor-pointer' onClick={StartCall}>
            {loading ? <Loader className='animate-spin' /> : <PhoneCall />}Start Call</Button> :
          <Button variant={"destructive"} className='mt-10 cursor-pointer' onClick={endCall}>
            {loading ? <Loader className='animate-spin' /> : <PhoneOff />} Disconnect</Button>
        }
      </div>
      }
    </div>
  )
}

export default MedicalVoiceAgent


