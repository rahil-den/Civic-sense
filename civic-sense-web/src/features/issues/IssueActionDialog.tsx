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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Issue, IssueStatus } from "@/types";
import { Star, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface IssueActionDialogProps {
    issue: Issue | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (id: string, status: IssueStatus, remarks: string) => void;
    onToggleImportant: (id: string) => void;
}

export const IssueActionDialog = ({ issue, open, onOpenChange, onSave, onToggleImportant }: IssueActionDialogProps) => {
    const [status, setStatus] = useState<IssueStatus>('open');
    const [remarks, setRemarks] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isImportant, setIsImportant] = useState(false);

    useEffect(() => {
        if (issue) {
            setStatus(issue.status); // set initial status
            setRemarks(''); // Reset remarks for new action
            setIsImportant(issue.isImportant || false);
        }
    }, [issue, open]);

    const handleSave = () => {
        if (issue) {
            onSave(issue.id, status, remarks);
            onOpenChange(false);
        }
    };

    const handleImportantToggle = () => {
        if (issue) {
            setIsImportant(!isImportant); // Optimistic
            onToggleImportant(issue.id);
        }
    };

    if (!issue) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle>Issue Details: {issue.id.slice(0, 8)}</DialogTitle>
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="important-mode" className="text-sm font-medium">Important</Label>
                            <Switch
                                id="important-mode"
                                checked={isImportant}
                                onCheckedChange={handleImportantToggle}
                            />
                        </div>
                    </div>
                    <DialogDescription>
                        Manage status, view timeline, and prioritize.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview & Action</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline & History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 py-4">
                        <div className="grid gap-4">
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
                                <Label htmlFor="remarks" className="text-right">New Remarks</Label>
                                <div className="col-span-3">
                                    <Textarea
                                        id="remarks"
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Add investigation notes or reason for status change..."
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
                    </TabsContent>

                    <TabsContent value="timeline" className="space-y-4 py-4">
                        <div className="space-y-4">
                            {issue.timeline && issue.timeline.length > 0 ? (
                                issue.timeline.map((event, index) => (
                                    <div key={index} className="flex gap-4 pb-4 border-b last:border-0 border-slate-100 dark:border-slate-800">
                                        <div className="mt-1">
                                            {event.action === 'STATUS_CHANGE' ? <Clock className="h-5 w-5 text-blue-500" /> :
                                                event.action === 'IMPORTANT_FLAG' ? <AlertTriangle className="h-5 w-5 text-amber-500" /> :
                                                    event.action === 'SOLVED' ? <Star className="h-5 w-5 text-green-500" /> :
                                                        <Clock className="h-5 w-5 text-slate-400" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {event.action.replace('_', ' ')}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {event.note}
                                            </p>
                                            <div className="flex items-center pt-2">
                                                <span className="text-xs text-slate-500">
                                                    {format(new Date(event.timestamp), 'PPp')}
                                                </span>
                                                {event.by && (
                                                    <span className="text-xs text-slate-500 ml-2">
                                                        by {typeof event.by === 'object' ? event.by.name : 'Admin'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground text-sm">
                                    No timeline events yet.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
