"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { Loader, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { SessionDetail } from '../../types';

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
  const [callDuration, setCallDuration] = useState(0);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId])

  // Timer logic - starts when call connects
  useEffect(() => {
    if (callStarted && callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStarted, callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    setCallDuration(0);
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
    console.log("StartCall function called");
    console.log("Session detail:", sessionDetail);

    if (!sessionDetail || !sessionDetail.selectedDoctor) {
      toast.error("Session details not loaded yet");
      console.error("Session details missing");
      return;
    }

    setLoading(true);
    setCallStatus('starting');
    console.log("Call status set to starting");

    try {
      console.log("Creating Vapi instance with key:", process.env.NEXT_PUBLIC_VAPI_API_KEY?.substring(0, 10) + "...");
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
      setVapiInstance(vapi);
      console.log("Vapi instance created");

      console.log("Vapi config:", {
        name: sessionDetail.selectedDoctor.specialist + " AI",
        voiceId: sessionDetail.selectedDoctor.voiceId,
        prompt: sessionDetail.selectedDoctor.agentPrompt.substring(0, 100) + "..."
      });

      const VapiConfig: any = {
        name: sessionDetail.selectedDoctor.specialist + " AI",
        firstMessage: `Hello, I am your ${sessionDetail.selectedDoctor.specialist} AI. How can I help you today?`,
        transcriber: {
          provider: "assembly-ai" as const,
          language: "en" as const
        },
        voice: {
          provider: "vapi" as const,
          voiceId: sessionDetail.selectedDoctor.voiceId
        },
        model: {
          provider: "google" as const,
          model: "gemini-2.0-flash" as const,
          messages: [{
            role: "system" as const,
            content: sessionDetail.selectedDoctor.agentPrompt
          }],
          maxTokens: 250,
          temperature: 0.5
        }
      };

      vapi.on("call-start", handleCallStart);
      vapi.on("call-end", handleCallEnd);
      vapi.on("message", handleMessage);
      vapi.on("speech-start", handleSpeechStart);
      vapi.on("speech-end", handleSpeechEnd);
      vapi.on("error", handleError);
      console.log("Event listeners attached");

      console.log("Starting Vapi call...");
      const callResponse = await vapi.start(VapiConfig);
      console.log("Call response:", callResponse);
      console.log("Call started successfully!");
    } catch (error: any) {
      console.error("Error starting call:", error);
      console.error("Error details:", error.message, error.stack);
      toast.error(`Failed to start call: ${error.message || 'Unknown error'}`);
      setCallStatus('error');
    } finally {
      setLoading(false);
      console.log("StartCall function completed");
    }
  };

  const endCall = async () => {
    try {
      setLoading(true);
      setCallStatus('ending');

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

      // Save call duration to database
      console.log("Saving call duration:", callDuration, "seconds");
      await axios.post('/api/session-chat', {
        sessionId: sessionId,
        callDuration: callDuration,
      });

      await GenerateReport();

      setCallStarted(false);
      setLiveTranscript('');
      setCurrentRole('');
      setMessages([]);
      setCallDuration(0);

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

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-teal-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!sessionDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load session details.</p>
          <Button onClick={GetSessionDetails} className="bg-teal-600 hover:bg-teal-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-6 py-6 border-b border-white/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            {sessionDetail.selectedDoctor?.specialist || 'Specialist'}
          </h2>
          <div className="flex items-center justify-center gap-2">
            {callStarted && callStatus === 'connected' && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Live</span>
                <span className="text-sm text-gray-500">•</span>
              </>
            )}
            <span className="text-lg font-bold text-teal-600">
              {formatTime(callDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Doctor Profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-2xl opacity-50 scale-110"></div>

            {/* Profile image container */}
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {sessionDetail.selectedDoctor?.image ? (
                  <Image
                    src={sessionDetail.selectedDoctor.image}
                    alt={sessionDetail.selectedDoctor.specialist}
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {sessionDetail.selectedDoctor?.specialist?.charAt(0) || 'D'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Listening indicator */}
            {callStarted && callStatus === 'connected' && currentRole === 'assistant' && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-teal-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-4 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-4 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Listening...</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {sessionDetail.selectedDoctor?.specialist || 'Specialist'}
          </h2>

          {/* Current message from assistant */}
          {liveTranscript && (
            <p className="text-center text-gray-700 max-w-md px-4 py-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
              {liveTranscript}
            </p>
          )}

          {!liveTranscript && messages.length > 0 && (
            <p className="text-center text-gray-700 max-w-md px-4 py-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
              {messages[messages.length - 1].text}
            </p>
          )}

          {!liveTranscript && messages.length === 0 && callStarted && (
            <p className="text-center text-gray-600 max-w-md">
              I'm analyzing your symptoms. Could you describe them in detail?
            </p>
          )}
        </div>

        {/* Conversation History */}
        {messages.length > 0 && (
          <div className="mb-8 space-y-3 max-h-64 overflow-y-auto px-2">
            {messages.slice(-4).map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${message.role === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-800'
                    }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center items-center mt-12">
          {!callStarted ? (
            <button
              onClick={StartCall}
              disabled={loading}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 flex items-center justify-center transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-9 h-9 text-white animate-spin" />
              ) : (
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
              )}
            </button>
          ) : (
            <button
              onClick={endCall}
              disabled={loading}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-9 h-9 text-white animate-spin" />
              ) : (
                <PhoneOff className="w-9 h-9 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Call Status Text */}
        <div className="text-center mt-6">
          {callStatus === 'starting' && (
            <p className="text-sm text-gray-600">Connecting to your specialist...</p>
          )}
          {callStatus === 'connected' && callStarted && (
            <p className="text-sm text-gray-600">Tap the red button to end consultation</p>
          )}
          {callStatus === 'ending' && (
            <p className="text-sm text-gray-600">Generating your medical report...</p>
          )}
          {callStatus === 'idle' && !callStarted && (
            <p className="text-sm text-gray-600">Tap to start your voice consultation</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalVoiceAgent
