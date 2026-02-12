"use client"
import React, { useEffect, useState } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Loader2, Plus, Stethoscope } from "lucide-react"
import axios from "axios"
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard"
import SuggestedDoctorCard from "./SuggestedDoctorCard"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { SessionDetail } from '../types';


const AddNewSession = () => {
    const [note, setNote] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([])
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>()
    const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const { has } = useAuth()
    const paidUser = has ? has({ plan: "pro" }) : false

    useEffect(() => {
        if (has) {
            GetHistoryList()
        }
    }, [has])

    const GetHistoryList = async () => {
        const result = await axios.get("/api/session-chat?sessionId=all")
        console.log(result.data);
        setHistoryList(result.data);
    }

    const onClickNext = async () => {
        setLoading(true);
        try {
            const result = await axios.post("/api/suggest-doctors", {
                notes: note,
            });
            console.log("API Response:", result.data);

            // make sure it's an array before setting
            setSuggestedDoctors(Array.isArray(result.data.JSONResp) ? result.data.JSONResp : []);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setSuggestedDoctors([]); // fallback
        } finally {
            setLoading(false);
        }
    };

    const onStartConsultation = async () => {
        setLoading(true);
        //save all info to database
        const result = await axios.post("/api/session-chat", {
            notes: note,
            selectedDoctor: selectedDoctor,
        });
        console.log(result.data);

        if (result.data[0].sessionId) {
            console.log(result.data[0].sessionId);
            router.push("/dashboard/medical-agent/" + result.data[0].sessionId);
        }

        setLoading(false);
    }

    const handleClose = () => {
        setOpen(false)
        // Reset state after dialog closes
        setTimeout(() => {
            setNote(undefined)
            setSuggestedDoctors([])
            setSelectedDoctor(undefined)
        }, 200)
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all"
                        disabled={!paidUser && historyList.length >= 1}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Start New Consultation
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl rounded-3xl p-0 gap-0 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-white">
                                    {suggestedDoctors.length === 0 ? 'Start New Consultation' : 'Select Your Specialist'}
                                </DialogTitle>
                                <p className="text-teal-100 text-sm mt-1">
                                    {suggestedDoctors.length === 0
                                        ? 'Tell us about your symptoms'
                                        : 'Choose the best doctor for your needs'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-gray-50">
                        <DialogDescription asChild>
                            {suggestedDoctors.length === 0 ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Describe Your Symptoms
                                        </label>
                                        <Textarea
                                            placeholder="E.g., I have a headache and fever for the past 2 days..."
                                            className="h-[200px] rounded-xl border-2 border-gray-200 focus:border-teal-500 bg-white resize-none"
                                            onChange={(e) => setNote(e.target.value)}
                                            value={note || ''}
                                        />
                                    </div>
                                    <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold text-teal-700">Tip:</span> Be as specific as possible about your symptoms, duration, and severity for better recommendations.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-900">Your symptoms:</span> {note}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {suggestedDoctors.map((doctor, index) => (
                                            <SuggestedDoctorCard
                                                key={index}
                                                doctorAgent={doctor}
                                                setSelectedDoctor={setSelectedDoctor}
                                                selectedDoctor={selectedDoctor!}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </div>

                    {/* Footer */}
                    <div className="bg-white border-t-2 border-gray-100 p-6 flex gap-3">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl border-2 border-gray-300 py-6 font-semibold"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        {suggestedDoctors.length === 0 ? (
                            <Button
                                disabled={!note || loading}
                                type="submit"
                                onClick={onClickNext}
                                className="flex-1 bg-teal-600 hover:bg-teal-700 rounded-xl py-6 font-semibold shadow-md"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 w-5 h-5" />
                                        Finding Specialists...
                                    </>
                                ) : (
                                    <>
                                        Next Step
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => onStartConsultation()}
                                disabled={!selectedDoctor || loading}
                                className="flex-1 bg-teal-600 hover:bg-teal-700 rounded-xl py-6 font-semibold shadow-md"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 w-5 h-5" />
                                        Starting...
                                    </>
                                ) : (
                                    <>
                                        Start Consultation
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewSession
