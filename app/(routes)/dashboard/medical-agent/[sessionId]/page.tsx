"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"

export type SessionDetail = {
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
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [callStatus, setCallStatus] = useState<string>('idle');
  const router = useRouter();
  
  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId])

  const GetSessionDetails = async () => {
    try {
      setSessionLoading(true);
      const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
      console.log("Session details:", result.data);
      setSessionDetail(result.data);
    } catch (error) {
      console.error("Error fetching session details:", error);
      toast.error("Failed to load session details");
    } finally {
      setSessionLoading(false);
    }
  }

  let handleCallStart = () => { 
    setCallStarted(true); 
    setCallStatus('connected');
    console.log('Call started'); 
  };
  
  let handleCallEnd = () => { 
    setCallStarted(false); 
    setCallStatus('ended');
    console.log('Call ended'); 
  };

  let handleError = (error: any) => {
    console.error("Vapi error:", error);
    setCallStatus('error');
    toast.error(`Call error: ${error.message || 'Unknown error'}`);
  };

  let handleSpeechStart = () => {
    console.log("Assistant started speaking");
    setCurrentRole("assistant");
  };

  let handleSpeechEnd = () => {
    console.log("Assistant stopped speaking");
    setCurrentRole("user");
  };
  
  let handleMessage = (message: any) => {
    console.log("Message received:", message);
    if (message.type === 'transcript') {
      const { role, transcript, transcriptType } = message;
      if (transcriptType === 'partial') {
        setLiveTranscript(transcript);
        setCurrentRole(role);
      } else if (transcriptType === 'final') {
        setMessages((prev) => [...prev, { role, text: transcript }]);
        setLiveTranscript('');
        setCurrentRole('');
      }
    }
  };

  const StartCall = async () => {
    if (!sessionDetail || !sessionDetail.selectedDoctor) {
      toast.error("Session details not loaded yet");
      return;
    }

    setLoading(true);
    setCallStatus('starting');
    try {
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
      setVapiInstance(vapi);

      // Log the configuration for debugging
      console.log("Vapi config:", {
        name: sessionDetail.selectedDoctor.specialist + " AI",
        voiceId: sessionDetail.selectedDoctor.voiceId,
        prompt: sessionDetail.selectedDoctor.agentPrompt.substring(0, 100) + "..."
      });

      // OPTION 1: Use the working assistant ID (comment out the other option)
      // const VapiConfig = {
      //   assistantId: "562d8c12-2e50-405c-9a23-5a8126d8849d",
      // };

  const VapiConfig = {
  name: sessionDetail.selectedDoctor.specialist + " AI",
  firstMessage: `Hello, I am your ${sessionDetail.selectedDoctor.specialist} AI. How can I help you today?`,
  
  transcriber: {
    provider: "assembly-ai", // Match your dashboard
    language: "en"
  },

  voice: {
    provider: "vapi", // Change from "playht" to "vapi"
    voiceId: sessionDetail.selectedDoctor.voiceId // Use Vapi-compatible voice IDs
  },

  model: {
    provider: "google",
    model: "gemini-2.0-flash",
    messages: [{
      role: "system",
      content: sessionDetail.selectedDoctor.agentPrompt
    }],
    maxTokens: 250,
    temperature: 0.5
  }
};

      // Set up all event listeners first
      vapi.on("call-start", handleCallStart);
      vapi.on("call-end", handleCallEnd);
      vapi.on("message", handleMessage);
      vapi.on("speech-start", handleSpeechStart);
      vapi.on("speech-end", handleSpeechEnd);
      vapi.on("error", handleError);

      // Start the call
      //@ts-ignore
      const callResponse = await vapi.start(VapiConfig);
      console.log("Call response:", callResponse);

    } catch (error: any) {
      console.error("Error starting call:", error);
      toast.error(`Failed to start call: ${error.message || 'Unknown error'}`);
      setCallStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const endCall = async () => {
    try {
      setLoading(true);
      setCallStatus('ending');

      // Stop vapi if it exists first
      if (vapiInstance) {
        vapiInstance.stop();
        vapiInstance.off('call-start', handleCallStart);
        vapiInstance.off('call-end', handleCallEnd);
        vapiInstance.off('message', handleMessage);
        vapiInstance.off('speech-start', handleSpeechStart);
        vapiInstance.off('speech-end', handleSpeechEnd);
        vapiInstance.off('error', handleError);
        setVapiInstance(null);
      }

      // Generate report after stopping the call
      await GenerateReport();

      // Reset states
      setCallStarted(false);
      setLiveTranscript('');
      setCurrentRole('');
      setMessages([]);

      router.push('/dashboard');

      toast.success("Your report is generated successfully", { duration: 3000 });

    } catch (error) {
      console.error("Error ending call:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
      setCallStatus('idle');
    }
  };

  const GenerateReport = async () => {
    try {
      const result = await axios.post("/api/medical-report", {
        sessionId: sessionId, 
        messages: messages, 
        sessionDetail: sessionDetail
      });
      console.log("Report generated:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  }

  return (
    <div className='p-5 border rounded-2xl bg-secondary '>
      <div className='flex justify-between items-center mt-6 '>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'>
          <Circle className={`h-4 w-4 rounded-full ${
            callStatus === 'connected' ? 'bg-green-500' : 
            callStatus === 'error' ? 'bg-yellow-500' : 
            'bg-red-500'
          }`} />
          {callStatus === 'starting' ? 'Starting...' : 
           callStatus === 'connected' ? 'Connected' : 
           callStatus === 'ending' ? 'Ending...' : 
           callStatus === 'error' ? 'Error' : 
           'Not Connected'}
        </h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>
      
      {sessionLoading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader className="animate-spin" />
          <span className="ml-2">Loading session details...</span>
        </div>
      ) : sessionDetail ? (
        <div className='flex flex-col justify-center items-center mt-10'>
          <div className='flex flex-col justify-center items-center'>
            <Image 
              src={sessionDetail.selectedDoctor.image} 
              alt={sessionDetail.selectedDoctor.specialist} 
              width={120} 
              height={120}
              className='h-[100px] w-[100px] object-cover rounded-full' 
            />
            <h2 className='mt-2 font-bold text-lg'>{sessionDetail.selectedDoctor.specialist}</h2>
            <p className='text-gray-500 text-sm'>Ai Voice Agent</p>
          </div>

          <div className='mt-12 flex flex-col justify-center items-center overflow-y-auto px-10 md:px-28 lg:px-52 xl:px-72 '>
            {messages?.slice(-4).map((message, index) => (
              <h2 key={index} className='text-gray-500 p-2'>
                {message.role === "user" ? "You" : "Assistant"}: {message.text}
              </h2>
            ))}

            {liveTranscript && (
              <h2 className='text-lg '> 
                {currentRole == "user" ? "You" : "Assistant"}: {liveTranscript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button className='mt-10 cursor-pointer' onClick={StartCall} disabled={loading}>
              {loading ? <Loader className='animate-spin' /> : <PhoneCall />}Start Call
            </Button>
          ) : (
            <Button variant={"destructive"} className='mt-10 cursor-pointer' onClick={endCall} disabled={loading}>
              {loading ? <Loader className='animate-spin' /> : <PhoneOff />} Disconnect
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p>Failed to load session details. Please try again.</p>
          <Button className='mt-4' onClick={GetSessionDetails}>
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}

export default MedicalVoiceAgent