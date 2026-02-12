import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Calendar, FileText, AlertCircle, Pill, Stethoscope, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

type Props = {
  report: any;
  onClose: () => void;
};

const Section = ({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon: any;
  children: React.ReactNode
}) => (
  <div className="bg-white rounded-xl border-2 border-gray-100 p-5">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-teal-600" />
      </div>
      <h3 className="font-bold text-lg text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

const ViewReportDialog = ({ report, onClose }: Props) => {
  const { user } = useUser();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-3xl border-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Medical Consultation Report
                </DialogTitle>
                <p className="text-teal-100 text-sm mt-1">AI-Generated Health Assessment</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-white/20 text-white absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content - with custom scrollbar */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] bg-gray-50 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-200">
          <div className="p-6 space-y-4">

            {/* Session Information */}
            <Section title="Session Information" icon={Calendar}>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  label="Doctor/Specialist"
                  value={report?.agent || "AI Assistant"}
                />
                <InfoCard
                  label="Consultation Date"
                  value={report?.timestamp ? new Date(report.timestamp).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  }) : 'Recent'}
                />
                <InfoCard
                  label="Patient"
                  value={user?.firstName || user?.fullName || "Patient"}
                />
                <InfoCard
                  label="Session Type"
                  value="AI Consultation"
                />
              </div>
            </Section>

            {/* Chief Complaint */}
            {report?.chiefComplaint && (
              <Section title="Chief Complaint" icon={AlertCircle}>
                <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-xl">
                  <p className="text-gray-900 leading-relaxed">{report.chiefComplaint}</p>
                </div>
              </Section>
            )}

            {/* Symptoms */}
            {report?.symptoms?.length > 0 && (
              <Section title="Reported Symptoms" icon={Stethoscope}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.symptoms.map((symptom: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                      <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-gray-900 text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Duration & Severity */}
            {(report?.duration || report?.severity) && (
              <Section title="Condition Details" icon={ClipboardList}>
                <div className="grid grid-cols-2 gap-4">
                  {report?.duration && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                      <p className="text-xs text-blue-600 font-semibold mb-1">Duration</p>
                      <p className="text-gray-900 font-bold text-lg">{report.duration}</p>
                    </div>
                  )}
                  {report?.severity && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
                      <p className="text-xs text-orange-600 font-semibold mb-1">Severity Level</p>
                      <p className="text-gray-900 font-bold text-lg">{report.severity}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Summary */}
            {report?.summary && (
              <Section title="Medical Summary" icon={FileText}>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-xl">
                  <p className="text-gray-900 leading-relaxed">{report.summary}</p>
                </div>
              </Section>
            )}

            {/* Medications */}
            {report?.medicationsMentioned?.length > 0 && (
              <Section title="Medications Mentioned" icon={Pill}>
                <div className="space-y-2">
                  {report.medicationsMentioned.map((med: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-purple-50 border border-purple-200 p-3 rounded-xl">
                      <Pill className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">{med}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Recommendations */}
            {report?.recommendations?.length > 0 && (
              <Section title="Medical Recommendations" icon={ClipboardList}>
                <div className="space-y-3">
                  {report.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-gradient-to-r from-teal-50 to-teal-100 border-l-4 border-teal-600 p-4 rounded-xl">
                      <div className="flex-shrink-0 w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <span className="flex-1 text-gray-900 leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* No Report Available */}
            {!report && (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-semibold">No report data available</p>
                <p className="text-gray-400 text-sm mt-2">The consultation report has not been generated yet</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Medical Disclaimer</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    This report is generated by an AI assistant and should not replace professional medical advice.
                    Please consult with a qualified healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;
