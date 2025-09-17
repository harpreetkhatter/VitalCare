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
import { ArrowRight, Loader2 } from "lucide-react"
import axios from "axios"
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard"
import SuggestedDoctorCard from "./SuggestedDoctorCard"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { SessionDetail } from '../medical-agent/[sessionId]/page';


const AddNewSession = () => {
    const [note, setNote] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([])
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>()
    const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
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
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-3" disabled={!paidUser&&historyList.length>=1}>+ Start Consultation</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        {suggestedDoctors.length === 0 &&
                            <DialogTitle>Add Basic Details</DialogTitle>}
                        <DialogDescription asChild>
                            {suggestedDoctors.length === 0 ? (
                                <div>
                                    <h2>Add symptoms or Any Other Details</h2>
                                    <Textarea
                                        placeholder="Describe your symptoms or any other details..."
                                        className="h-[200px] mt-1"
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2 className="font-bold text-lg py-1">Select the doctor</h2>
                                    <div className="grid grid-cols-3 gap-5">
                                        {suggestedDoctors.map((doctor, index) => (
                                            <SuggestedDoctorCard key={index} doctorAgent={doctor} setSelectedDoctor={() => setSelectedDoctor(doctor)} selectedDoctor={selectedDoctor!} />
                                        ))}
                                    </div>
                                </div>

                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        {suggestedDoctors.length === 0 ? (
                            <Button
                                disabled={!note || loading}
                                type="submit"
                                onClick={onClickNext}
                            >
                                Next
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <ArrowRight />
                                )}
                            </Button>
                        ) : (
                            <Button onClick={() => onStartConsultation()} disabled={!selectedDoctor || loading}>
                                Start Consultation
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <ArrowRight />
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewSession
