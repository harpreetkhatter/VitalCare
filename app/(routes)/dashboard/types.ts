import { doctorAgent } from './_components/DoctorAgentCard';

export type SessionDetail = {
  id: number,
  sessionId: string,
  createdBy: string,
  notes: string,
  selectedDoctor: doctorAgent,
  report: JSON,
  callDuration?: number,
  createdOn: Date,
}
