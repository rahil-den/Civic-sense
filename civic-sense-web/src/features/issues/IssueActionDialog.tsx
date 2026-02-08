import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Issue, IssueStatus } from "@/types";

interface IssueActionDialogProps {
    issue: Issue | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (issueId: string, status: IssueStatus, remarks: string) => void;
}

export const IssueActionDialog = ({ issue, open, onOpenChange, onSave }: IssueActionDialogProps) => {
    const [status, setStatus] = useState<IssueStatus>('open');
    const [remarks, setRemarks] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (issue) {
            setStatus(issue.status); // set initial status
            setRemarks(issue.remarks?.[0] || '');
        }
    }, [issue, open]);

    const handleSave = () => {
        if (issue) {
            console.log("Saving with file:", file);
            onSave(issue.id, status, remarks);
            onOpenChange(false);
        }
    };

    if (!issue) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Issue Details: {issue.id.slice(0, 8)}</DialogTitle>
                    <DialogDescription>
                        Update the status or add remarks for this issue.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Category</Label>
                        <div className="col-span-3 font-medium capitalize flex items-center gap-2">
                            {issue.category}
                            <span className="text-xs text-muted-foreground">({issue.priority})</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Description</Label>
                        <div className="col-span-3 text-sm text-slate-600 dark:text-slate-300">
                            {issue.description}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Location</Label>
                        <div className="col-span-3 text-sm text-slate-500 truncate">
                            {issue.location.address}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <div className="col-span-3">
                            <Select value={status} onValueChange={(val) => setStatus(val as IssueStatus)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="remarks" className="text-right">Remarks</Label>
                        <div className="col-span-3">
                            <Textarea
                                id="remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Add investigation notes..."
                                className="h-24"
                            />
                        </div>
                    </div>

                    {status === 'resolved' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="proof" className="text-right">Proof</Label>
                            <div className="col-span-3">
                                <input
                                    type="file"
                                    id="proof"
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Update Issue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
