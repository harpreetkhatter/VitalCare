import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SessionDetail } from '../types';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import ViewReportDialog from './ViewReportDialog';

type Props = {
    historyList: SessionDetail[];
}

const HistoryTable = ({ historyList }: Props) => {
    const [selectedReport, setSelectedReport] = useState<SessionDetail | null>(null);

    return (
        <div>
            <Table>
                <TableCaption>Previous Consultations Reports</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">AI Medical Specialist</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {historyList.map((record: SessionDetail, index: number) => (
                        <TableRow key={record.sessionId || index}>
                            <TableCell className="font-medium">{record.selectedDoctor.specialist}</TableCell>
                            <TableCell>{record.notes}</TableCell>
                            <TableCell>
                                {moment(new Date(record.createdOn)).fromNow()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    onClick={() => setSelectedReport(record)}
                                    variant="outline"
                                    className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700 font-bold px-6 rounded-lg"
                                >
                                    VIEW REPORT
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* View Report Dialog */}
            {selectedReport && (
                <ViewReportDialog
                    report={selectedReport.report}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    )
}

export default HistoryTable