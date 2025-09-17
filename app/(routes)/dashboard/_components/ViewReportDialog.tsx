import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from "moment";

type Props = {
  record: SessionDetail;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-semibold text-blue-600 border-b border-blue-200 pb-1 mb-2">
      {title}
    </h3>
    {children}
  </div>
);

const ViewReportDialog = ({ record }: Props) => {
  // Extract structured report
  const report = record.report as any;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm">
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-center text-xl font-bold text-blue-700">
              Medical AI Voice Agent Report
            </h2>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-6 space-y-6 text-gray-800 text-sm">
              
              {/* Session Info */}
              <Section title="Session Info">
                <div className="grid grid-cols-2 gap-2">
                  <p><span className="font-bold">Doctor:</span> {record.selectedDoctor?.specialist || "N/A"}</p>
                  <p><span className="font-bold">User:</span> {report?.user || record.createdBy || "Anonymous"}</p>
                  <p><span className="font-bold">Consulted On:</span> {moment(report?.timestamp || record.createdOn).format("MMMM Do YYYY, h:mm a")}</p>
                  <p><span className="font-bold">Agent:</span> {report?.agent || record.selectedDoctor?.specialist || "AI Assistant"}</p>
                </div>
              </Section>

              {/* Chief Complaint */}
              <Section title="Chief Complaint">
                <p>{report?.chiefComplaint || "Not provided"}</p>
              </Section>

              {/* Summary */}
              <Section title="Summary">
                <p>{report?.summary || "No summary available"}</p>
              </Section>

              {/* Symptoms */}
              {report?.symptoms?.length > 0 && (
                <Section title="Symptoms">
                  <ul className="list-disc pl-6">
                    {report.symptoms.map((symptom: string, i: number) => (
                      <li key={i}>{symptom}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Duration & Severity */}
              <Section title="Duration & Severity">
                <p><span className="font-bold">Duration:</span> {report?.duration || "Unknown"}</p>
                <p><span className="font-bold">Severity:</span> {report?.severity || "Unknown"}</p>
              </Section>

              {/* Medications */}
              {report?.medicationsMentioned?.length > 0 && (
                <Section title="Medications Mentioned">
                  <ul className="list-disc pl-6">
                    {report.medicationsMentioned.map((med: string, i: number) => (
                      <li key={i}>{med}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Recommendations */}
              {report?.recommendations?.length > 0 && (
                <Section title="Recommendations">
                  <ul className="list-disc pl-6">
                    {report.recommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;
